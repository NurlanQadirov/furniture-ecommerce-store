# Deploy — Hetzner VPS (91.99.96.163)

Sayt serverdəki digər Next.js saytları ilə eyni konvensiya ilə qurulub: kod
`/srv/apps/<ad>` altında, `deploy` istifadəçisi adından systemd servisi, qarşısında
nginx. Heç bir mövcud sayt konfiqi dəyişdirilmir — yalnız yeni fayllar əlavə olunur.

| | mebeltech |
|---|---|
| Qovluq | `/srv/apps/mebeltech` |
| Servis | `mebeltech.service` |
| Next.js portu | `127.0.0.1:3004` (yalnız loopback) |
| Nginx portu | `8083` (müvəqqəti — domen olanda `listen 80`) |
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
`sitemap.xml` — hamısı `NEXT_PUBLIC_SITE_URL`-dən qurulur. `.env`-də hazırda yoxdur,
yəni koddakı `https://mebeltech.az` defoltu işləyir: sayt `91.99.96.163:8083`-də
açılsa da, canonical-lar `mebeltech.az` göstərir. Domen hələ bağlanmadığı və saytın
heç yerdən linki olmadığı üçün bunu indi oxuyan bir crawler yoxdur, amma domen
bağlanan kimi bu dəyər düz olmalıdır.

`NEXT_PUBLIC_*` build zamanı koda yazılır, runtime-da oxunmur — dəyişəndən sonra
sadəcə restart bəs etmir, mütləq yenidən build lazımdır:

```bash
ssh root@91.99.96.163 'echo "NEXT_PUBLIC_SITE_URL=https://domen.az" >> /srv/apps/mebeltech/.env &&
  cd /srv/apps/mebeltech &&
  sudo -u deploy env HOME=/srv/apps/mebeltech NODE_ENV=production npm run build &&
  systemctl restart mebeltech'
```

## Domen bağlananda

1. `deploy/nginx-mebeltech.conf`-da `listen 8083` → `listen 80;` + `server_name domen.az www.domen.az;`
   (`default_server` YAZMA — o rol `000-catchall`-dadır).
2. `certbot --nginx -d domen.az -d www.domen.az` ilə sertifikat.
3. `.env`-də `ADMIN_EMAIL`/`ADMIN_PASSWORD` real dəyərlərlə əvəz olunsun; `ufw delete allow 8083/tcp`.

HTTPS-ə keçənə qədər giriş şifrəsi şifrələnməmiş kanalla gedir — `admin123` yalnız
test üçündür.
