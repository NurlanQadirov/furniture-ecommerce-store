'use client';

import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';
import NumberField from '@/components/calculator/NumberField';
import OptionCard from '@/components/calculator/OptionCard';
import QuantityStepper from '@/components/calculator/QuantityStepper';
import LeadForm from '@/components/calculator/LeadForm';
import { estimate, type CalculatorInput, type Quantities } from '@/lib/calc/estimate';
import type { AddOn, CalculatorSettings, RoomType } from '@/lib/store/schema';
import { useLocalized } from '@/lib/i18n/localized';
import type { TranslationKey } from '@/lib/i18n/resources';

interface CalculatorWizardProps {
  settings: CalculatorSettings;
}

type StepId = 'room' | 'size' | 'material' | 'hardware' | 'extras' | 'model';

const stepsByRoom: Record<RoomType, StepId[]> = {
  // Ready-made models need nothing but a pick — two taps to a number.
  fixed: ['room', 'model'],
  kitchen: ['room', 'size', 'material', 'hardware', 'extras'],
  wardrobe: ['room', 'size', 'material', 'hardware', 'extras'],
  living: ['room', 'size', 'material', 'hardware', 'extras'],
};

const stepLabels: Record<StepId, TranslationKey> = {
  room: 'calc_step_room',
  size: 'calc_step_size',
  material: 'calc_step_material',
  hardware: 'calc_step_hardware',
  extras: 'calc_step_extras',
  model: 'calc_model',
};

const roomLabels: Record<RoomType, { title: TranslationKey; desc: TranslationKey }> = {
  kitchen: { title: 'room_kitchen', desc: 'room_kitchen_desc' },
  wardrobe: { title: 'room_wardrobe', desc: 'room_wardrobe_desc' },
  living: { title: 'room_living', desc: 'room_living_desc' },
  fixed: { title: 'room_fixed', desc: 'room_fixed_desc' },
};

/** Order the room cards are offered in — kitchens are what most visitors want. */
const roomOrder: RoomType[] = ['kitchen', 'wardrobe', 'living', 'fixed'];

/**
 * Covers for the room cards. Deliberately fixed rather than borrowed from the
 * first material of each section: those are swatches, and several rooms would
 * end up showing the same one.
 */
const roomImages: Record<RoomType, string> = {
  kitchen: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=600&q=80',
  wardrobe: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=600&q=80',
  living: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
  fixed: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
};

interface Sizes {
  lowerM: number;
  upperM: number;
  counterM: number;
  width: number;
  height: number;
  quantity: number;
}

const initialSizes: Sizes = {
  lowerM: 3,
  upperM: 2.5,
  counterM: 3,
  width: 2,
  height: 2.4,
  quantity: 1,
};

/** First option of every list — a sensible pre-selection for each step. */
function initialChoices(settings: CalculatorSettings): Record<string, string> {
  return {
    kitchenMaterial: settings.kitchen.materials[0]?.id ?? '',
    counterTop: settings.kitchen.counterTops[0]?.id ?? '',
    kitchenHardware: settings.kitchen.hardwareLevels[1]?.id ?? settings.kitchen.hardwareLevels[0]?.id ?? '',
    wardrobeMaterial: settings.wardrobe.materials[0]?.id ?? '',
    doorType: settings.wardrobe.doorTypes[0]?.id ?? '',
    depth: settings.wardrobe.depthOptions[0]?.id ?? '',
    glass: settings.wardrobe.glassOptions[0]?.id ?? '',
    wardrobeHardware:
      settings.wardrobe.hardwareLevels[1]?.id ?? settings.wardrobe.hardwareLevels[0]?.id ?? '',
    livingMaterial: settings.living.materials[0]?.id ?? '',
    livingHardware:
      settings.living.hardwareLevels[1]?.id ?? settings.living.hardwareLevels[0]?.id ?? '',
    model: settings.fixed.models[0]?.id ?? '',
  };
}

export default function CalculatorWizard({ settings }: CalculatorWizardProps) {
  const { t } = useTranslation();
  const loc = useLocalized();

  const [room, setRoom] = useState<RoomType>('kitchen');
  const [stepIndex, setStepIndex] = useState(0);
  const [sizes, setSizes] = useState<Sizes>(initialSizes);
  const [choices, setChoices] = useState<Record<string, string>>(() =>
    initialChoices(settings),
  );
  const [quantities, setQuantities] = useState<Quantities>({});

  // The worktop follows the lower units until the visitor overrides it.
  const counterTouched = useRef(false);

  const steps = stepsByRoom[room];
  const isResult = stepIndex >= steps.length;
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)] as StepId;

  const setChoice = (key: string, value: string) =>
    setChoices((previous) => ({ ...previous, [key]: value }));

  const setQuantity = (id: string, value: number) =>
    setQuantities((previous) => ({ ...previous, [id]: value }));

  const input: CalculatorInput = useMemo(() => {
    if (room === 'kitchen') {
      return {
        room: 'kitchen',
        lowerM: sizes.lowerM,
        upperM: sizes.upperM,
        counterM: sizes.counterM,
        materialId: choices.kitchenMaterial ?? '',
        counterTopId: choices.counterTop ?? '',
        hardwareId: choices.kitchenHardware ?? '',
        quantities,
      };
    }
    if (room === 'wardrobe') {
      return {
        room: 'wardrobe',
        width: sizes.width,
        height: sizes.height,
        materialId: choices.wardrobeMaterial ?? '',
        doorTypeId: choices.doorType ?? '',
        depthId: choices.depth ?? '',
        glassId: choices.glass ?? '',
        hardwareId: choices.wardrobeHardware ?? '',
        quantities,
      };
    }
    if (room === 'living') {
      return {
        room: 'living',
        width: sizes.width,
        height: sizes.height,
        materialId: choices.livingMaterial ?? '',
        hardwareId: choices.livingHardware ?? '',
        quantities,
      };
    }
    return { room: 'fixed', modelId: choices.model ?? '', quantity: sizes.quantity };
  }, [room, sizes, choices, quantities]);

  const result = useMemo(() => estimate(input, settings), [input, settings]);

  const currency = t('currency_azn');

  /** Plain-text recap sent along with the lead so the owner can call prepared. */
  const summary = useMemo(() => {
    const parts = [t(roomLabels[room].title)];
    result.lines
      .filter((line) => line.amount > 0 || line.labelKey === 'calc_line_door_type')
      .forEach((line) => {
        const label = t(line.labelKey as TranslationKey);
        const name = line.name ? ` — ${loc(line.name)}` : '';
        const detail = line.detail ? ` (${line.detail})` : '';
        parts.push(`${label}${name}${detail}`);
      });
    return parts.join('; ');
  }, [room, result.lines, t, loc]);

  function reset() {
    setRoom('kitchen');
    setStepIndex(0);
    setSizes(initialSizes);
    setChoices(initialChoices(settings));
    setQuantities({});
    counterTouched.current = false;
  }

  function renderAddOns(items: AddOn[]) {
    if (items.length === 0) {
      return <p className="text-gray-500">{t('calc_no_options')}</p>;
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <QuantityStepper
            key={item.id}
            label={loc(item.name)}
            price={item.price}
            currency={currency}
            value={quantities[item.id] ?? 0}
            max={item.max}
            onChange={(value) => setQuantity(item.id, value)}
          />
        ))}
      </div>
    );
  }

  const area = Number((sizes.width * sizes.height).toFixed(2));

  return (
    <div className="w-full max-w-[900px] mx-auto px-4 py-12">
      <header className="text-center mb-8">
        <h1 className="font-serif text-5xl text-dark-green">{t('calc_title')}</h1>
        <p className="mt-2 text-custom-black">{t('calc_subtitle')}</p>
      </header>

      <p className="mx-auto max-w-2xl text-center text-sm text-gray-500 bg-custom-green/60 rounded-lg px-4 py-3 mb-8">
        {t('calc_note')}
      </p>

      <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
        {/* Progress */}
        <div className="flex items-center gap-1 px-4 sm:px-8 pt-6">
          {steps.map((step, index) => (
            <div key={step} className="flex-1">
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  index <= stepIndex ? 'bg-dark-green' : 'bg-gray-200'
                }`}
              />
              <p
                className={`mt-2 text-[11px] sm:text-xs text-center transition-colors ${
                  index <= stepIndex ? 'text-dark-green font-bold' : 'text-gray-400'
                }`}
              >
                {t(stepLabels[step])}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 sm:p-8">
          {isResult ? (
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-sm uppercase tracking-widest text-gray-400">
                  {t('calc_result_title')}
                </p>
                <p className="font-serif text-5xl sm:text-6xl text-dark-green mt-2">
                  {result.min} – {result.max}
                </p>
                <p className="text-xl font-bold text-custom-black">{currency}</p>
                <p className="mt-4 text-sm text-gray-500 max-w-xl mx-auto">
                  {t('calc_result_range_note')}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">
                  {t('calc_result_breakdown')}
                </h3>
                <ul className="divide-y divide-gray-100 border-y border-gray-100">
                  {result.lines.map((line, index) => (
                    <li
                      key={`${line.labelKey}-${index}`}
                      className="flex items-baseline justify-between gap-4 py-2.5 text-sm"
                    >
                      <span className="text-custom-black">
                        {t(line.labelKey as TranslationKey)}
                        {line.name && (
                          <span className="text-gray-500"> — {loc(line.name)}</span>
                        )}
                        {line.detail && (
                          <span className="text-gray-400 text-xs"> · {line.detail}</span>
                        )}
                      </span>
                      <span className="font-bold tabular-nums whitespace-nowrap">
                        {line.amount > 0 ? `${line.amount} ${currency}` : '—'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <LeadForm
                summary={summary}
                estimateMin={result.min}
                estimateMax={result.max}
              />

              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 text-dark-green font-bold hover:underline"
              >
                <ArrowPathIcon className="h-5 w-5" />
                {t('calc_restart')}
              </button>
            </div>
          ) : (
            <div>
              {/*
                The page title stays in the script face, but these change on
                every step and are instructions rather than decoration — they
                read in the UI font so nobody has to decipher them mid-flow.
              */}
              <h2 className="font-inter text-2xl font-semibold text-dark-green mb-6">
                {currentStep === 'room' && t('calc_room_question')}
                {currentStep === 'size' && t('calc_size_question')}
                {currentStep === 'material' && t('calc_material_question')}
                {currentStep === 'hardware' && t('calc_hardware_question')}
                {currentStep === 'extras' && t('calc_extras_question')}
                {currentStep === 'model' && t('calc_room_question')}
              </h2>

              {currentStep === 'room' && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {roomOrder.map((option) => (
                    <OptionCard
                      key={option}
                      title={t(roomLabels[option].title)}
                      subtitle={t(roomLabels[option].desc)}
                      image={roomImages[option]}
                      selected={room === option}
                      onSelect={() => {
                        setRoom(option);
                        setQuantities({});
                      }}
                    />
                  ))}
                </div>
              )}

              {currentStep === 'size' && room === 'kitchen' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <NumberField
                      label={t('calc_kitchen_lower')}
                      value={sizes.lowerM}
                      onChange={(value) =>
                        setSizes((previous) => ({
                          ...previous,
                          lowerM: value,
                          counterM: counterTouched.current ? previous.counterM : value,
                        }))
                      }
                    />
                    <NumberField
                      label={t('calc_kitchen_upper')}
                      value={sizes.upperM}
                      onChange={(value) => setSizes((previous) => ({ ...previous, upperM: value }))}
                    />
                    <NumberField
                      label={t('calc_kitchen_counter')}
                      value={sizes.counterM}
                      onChange={(value) => {
                        counterTouched.current = true;
                        setSizes((previous) => ({ ...previous, counterM: value }));
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-custom-black mb-3">
                      {t('calc_counter_top')}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {settings.kitchen.counterTops.map((option) => (
                        <OptionCard
                          key={option.id}
                          title={loc(option.name)}
                          subtitle={`${option.pricePerM} ${currency} / m`}
                          image={option.image}
                          selected={choices.counterTop === option.id}
                          onSelect={() => setChoice('counterTop', option.id)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'size' && (room === 'wardrobe' || room === 'living') && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <NumberField
                      label={t('calc_width')}
                      value={sizes.width}
                      onChange={(value) => setSizes((previous) => ({ ...previous, width: value }))}
                    />
                    <NumberField
                      label={t('calc_height')}
                      value={sizes.height}
                      onChange={(value) => setSizes((previous) => ({ ...previous, height: value }))}
                    />
                  </div>
                  <p className="text-sm text-gray-500">{t('calc_area_hint', { area })}</p>

                  {room === 'wardrobe' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-bold text-custom-black mb-3">
                          {t('calc_door_type')}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {settings.wardrobe.doorTypes.map((option) => (
                            <OptionCard
                              key={option.id}
                              title={loc(option.name)}
                              selected={choices.doorType === option.id}
                              onSelect={() => setChoice('doorType', option.id)}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-custom-black mb-3">
                          {t('calc_depth')}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {settings.wardrobe.depthOptions.map((option) => (
                            <OptionCard
                              key={option.id}
                              title={loc(option.name)}
                              selected={choices.depth === option.id}
                              onSelect={() => setChoice('depth', option.id)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 'material' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {room === 'kitchen' &&
                      settings.kitchen.materials.map((option) => (
                        <OptionCard
                          key={option.id}
                          title={loc(option.name)}
                          subtitle={`${option.lowerPerM} ${currency} / m`}
                          image={option.image}
                          selected={choices.kitchenMaterial === option.id}
                          onSelect={() => setChoice('kitchenMaterial', option.id)}
                        />
                      ))}
                    {room === 'wardrobe' &&
                      settings.wardrobe.materials.map((option) => (
                        <OptionCard
                          key={option.id}
                          title={loc(option.name)}
                          subtitle={`${option.pricePerM2} ${currency} / m²`}
                          image={option.image}
                          selected={choices.wardrobeMaterial === option.id}
                          onSelect={() => setChoice('wardrobeMaterial', option.id)}
                        />
                      ))}
                    {room === 'living' &&
                      settings.living.materials.map((option) => (
                        <OptionCard
                          key={option.id}
                          title={loc(option.name)}
                          subtitle={`${option.pricePerM2} ${currency} / m²`}
                          image={option.image}
                          selected={choices.livingMaterial === option.id}
                          onSelect={() => setChoice('livingMaterial', option.id)}
                        />
                      ))}
                  </div>

                  {room === 'wardrobe' && (
                    <div>
                      <p className="text-sm font-bold text-custom-black mb-3">{t('calc_glass')}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {settings.wardrobe.glassOptions.map((option) => (
                          <OptionCard
                            key={option.id}
                            title={loc(option.name)}
                            subtitle={
                              option.pricePerM2 > 0
                                ? `${option.pricePerM2} ${currency} / m²`
                                : undefined
                            }
                            image={option.image}
                            selected={choices.glass === option.id}
                            onSelect={() => setChoice('glass', option.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 'hardware' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(room === 'kitchen'
                    ? settings.kitchen.hardwareLevels
                    : room === 'wardrobe'
                      ? settings.wardrobe.hardwareLevels
                      : settings.living.hardwareLevels
                  ).map((level) => {
                    const key =
                      room === 'kitchen'
                        ? 'kitchenHardware'
                        : room === 'wardrobe'
                          ? 'wardrobeHardware'
                          : 'livingHardware';
                    return (
                      <OptionCard
                        key={level.id}
                        title={loc(level.name)}
                        subtitle={loc(level.description)}
                        selected={choices[key] === level.id}
                        onSelect={() => setChoice(key, level.id)}
                      />
                    );
                  })}
                </div>
              )}

              {currentStep === 'extras' && room === 'kitchen' &&
                renderAddOns(settings.kitchen.accessories)}
              {currentStep === 'extras' && room === 'wardrobe' &&
                renderAddOns(settings.wardrobe.interiorItems)}
              {currentStep === 'extras' && room === 'living' &&
                renderAddOns(settings.living.modules)}

              {currentStep === 'model' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {settings.fixed.models.map((model) => (
                      <OptionCard
                        key={model.id}
                        title={loc(model.name)}
                        subtitle={`${model.price} ${currency} · ${loc(model.description)}`}
                        image={model.image}
                        selected={choices.model === model.id}
                        onSelect={() => setChoice('model', model.id)}
                      />
                    ))}
                  </div>
                  <div className="max-w-[200px]">
                    <NumberField
                      label={t('calc_quantity')}
                      value={sizes.quantity}
                      step={1}
                      min={1}
                      max={10}
                      onChange={(value) =>
                        setSizes((previous) => ({ ...previous, quantity: Math.round(value) }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {!isResult && (
          <div className="flex items-center justify-between gap-4 border-t border-gray-100 px-4 sm:px-8 py-5 bg-gray-50">
            <button
              type="button"
              onClick={() => setStepIndex((index) => Math.max(0, index - 1))}
              disabled={stepIndex === 0}
              className="inline-flex items-center gap-2 text-sm font-bold text-custom-black disabled:opacity-30"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              {t('calc_back')}
            </button>

            <span className="text-xs text-gray-400">
              {t('calc_step', { current: stepIndex + 1, total: steps.length })}
            </span>

            <button
              type="button"
              onClick={() => setStepIndex((index) => index + 1)}
              disabled={stepIndex === steps.length - 1 && !result.valid}
              className="inline-flex items-center gap-2 bg-dark-green text-white font-bold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-40 group"
            >
              {stepIndex === steps.length - 1 ? t('calc_show_result') : t('calc_next')}
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
