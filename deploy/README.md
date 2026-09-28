# Deploy — Hetzner VPS (91.99.96.163)

Sayt serverdəki digər Next.js saytları ilə eyni konvensiya ilə qurulub: kod
`/srv/apps/<ad>` altında, `deploy` istifadəçisi adından systemd servisi, qarşısında
nginx. Heç bir mövcud sayt konfiqi dəyişdirilmir — yalnız yeni fayllar əlavə olunur.

| | mebeltech |
|---|---|
| Qovluq | `/srv/apps/mebeltech` |
| Servis | `mebeltech.service` |
| Next.js portu | `127.0.0.1:3004` (yalnız loopback) |
| Domen | `bakumebel.az` (DNS: Hetzner, `www` → apex 301) |
| Nginx | `:80`/`:443`, `server_name bakumebel.az` |
| Env | `/srv/apps/mebeltech/.env` (0600, `deploy`-a məxsus) |

## Yeniləmə (yerli kompüterdən)

`--delete` vacibdir: onsuz repodan silinmiş fayl serverdə qalır və build tip
yoxlamasında sınır. Xaric edilən yollar (`store.json`, `uploads/`) silinmir —
rsync onları transferdən gizlədir.

`.npm/` və `.config/` də xaric edilməlidir. Build `HOME=/srv/apps/mebeltech` ilə
işlədiyi üçün npm keşini elə app qovluğunun içində yaradır. İlk deploy-da onlar
hələ yox idi, ona görə siyahıda deyildilər — indi isə `--delete` hər yeniləmədə
npm keşini silir.

Əvvəlcə `--dry-run --itemize-changes` ilə işlət və `*deleting` sətirlərinə bax:
silinən nə varsa, doğrudan da silinməlidirmi?

```bash
rsync -az --delete --exclude '.git/' --exclude 'node_modules/' --exclude '.next/' \
  --exclude '.npm/' --exclude '.config/' \
  --exclude 'data/store.json' --exclude 'public/uploads/*' --exclude '.env*' \
  ./ root@91.99.96.163:/srv/apps/mebeltech/

ssh root@91.99.96.163 'chown -R deploy:deploy /srv/apps/mebeltech &&
  cd /srv/apps/mebeltech &&
  sudo -u deploy env HOME=/srv/apps/mebeltech npm ci --no-audit --no-fund &&
  sudo -u deploy env HOME=/srv/apps/mebeltech NODE_ENV=production npm run build &&
  systemctl restart mebeltech'
```

`data/store.json` və `public/uploads/` rsync-dən kənarda saxlanılır — onlar panelin
yazdığı canlı məzmundur, deploy onları silməməlidir.

## Build-dən sonra şəkil keşini isit

`npm run build` `.next/cache`-i silir, deməli ilk ziyarətçi hero şəkillərinin
WebP-ə çevrilməsini gözləyir. Deploy-un sonunda bunu qabaqcadan et:

```bash
ssh root@91.99.96.163 'for img in furniture.jpg furniture2.jpg furniture3.jpg team.jpg; do
  for w in 640 750 828 1080 1200 1920 2048; do
    curl -s -o /dev/null -H "Accept: image/webp,*/*" \
      "http://127.0.0.1:3004/_next/image?url=%2F$img&w=$w&q=75"
  done
done'
```

Diqqət: `w` yalnız `next.config.ts`-dəki `deviceSizes` dəyərlərindən, `q` isə
yalnız 75 ola bilər — Next 16 başqa dəyərə 400 qaytarır.

## Loglar

```bash
ssh root@91.99.96.163 'journalctl -u mebeltech -n 100 --no-pager'
```

## Sayt ünvanı (SEO üçün)

Canonical, `hreflang`, JSON-LD `@id`-ləri, OpenGraph şəkilləri, `robots.txt` və
`sitemap.xml` — hamısı `NEXT_PUBLIC_SITE_URL`-dən qurulur (`.env`-də
`https://bakumebel.az`; yoxdursa koddakı defolt da eynidir).

`NEXT_PUBLIC_*` build zamanı koda yazılır, runtime-da oxunmur — dəyişəndən sonra
sadəcə restart bəs etmir, mütləq yenidən build lazımdır.

## Domenin bağlanması (bakumebel.az)

DNS Hetzner-dədir (nameserverlər: `hydrogen.ns.hetzner.com`, `oxygen.ns.hetzner.com`,
`helium.ns.hetzner.de`). Zonada lazım olan qeydlər:

| Tip | Ad | Dəyər |
|---|---|---|
| A | `@` | `91.99.96.163` |
| A | `www` | `91.99.96.163` |

2026-09-28-də bağlanıb. Aşağıdakı addımlar o zaman bir dəfə işlədilib — yalnız
serveri sıfırdan qurmaq lazım olsa təkrarlanır (certbot HTTP-01 yoxlaması DNS-siz
alınmır). Bu halda əvvəl faylın SSL hissəsiz, yalnız `:80` variantı qoyulur (sertifikat hələ yoxdursa, nginx `ssl_certificate` yollarını tapmayıb `nginx -t`-də yıxılır) — o variantdan `listen 443`, `ssl_*`, `include` sətirlərini və certbot-un iki `:80` blokunu çıxarıb `listen 80;` qaytarmaqla alınır:

```bash
rsync -az deploy/nginx-mebeltech.conf root@91.99.96.163:/etc/nginx/sites-available/mebeltech
ssh root@91.99.96.163 'nginx -t && systemctl reload nginx'
ssh -t root@91.99.96.163 'certbot --nginx -d bakumebel.az -d www.bakumebel.az --redirect'
ssh root@91.99.96.163 'cd /srv/apps/mebeltech &&
  { grep -q "^NEXT_PUBLIC_SITE_URL=" .env || echo "NEXT_PUBLIC_SITE_URL=https://bakumebel.az" >> .env; } &&
  sudo -u deploy env HOME=/srv/apps/mebeltech NODE_ENV=production npm run build &&
  systemctl restart mebeltech && ufw delete allow 8083/tcp'
```

`certbot --nginx` sertifikatı alır, `sites-available/mebeltech`-ə `listen 443 ssl`
əlavə edir və `:80`-i HTTPS-ə yönləndirir; yeniləməni `certbot.timer` edir.
`deploy/nginx-mebeltech.conf` certbot-dan sonrakı canlı faylın nüsxəsidir.

Dəyişiklikdən əvvəlki nginx faylı və `.env` yedəkləri: `/root/nginx-backups/`.

Sonra `.env`-də `ADMIN_EMAIL`/`ADMIN_PASSWORD` real dəyərlərlə əvəz olunsun
(`admin123` yalnız test üçündür) və `systemctl restart mebeltech`.
