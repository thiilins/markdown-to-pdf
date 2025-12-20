'use client'
import { ConditionalRender } from '@/components/custom-ui/conditional-render'
import { FullImageUpload, LogoUpload } from '@/components/custom-ui/image-upload'
import { SectionBox } from '@/components/custom-ui/section-box'
import { TooltipComponent } from '@/components/custom-ui/tooltip'
import { VisualEditorComponent } from '@/components/custom-ui/visual-editor'
import { VisualEditorProvider } from '@/components/custom-ui/visual-editor/VisualEditorContext'
import { ViewModeButtons } from '@/components/custom-ui/visual-editor/editors'
import { VariableSelector } from '@/components/custom-ui/visual-editor/features'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'
import {
  HEADER_FOOTER_VARIABLES,
  HEADER_FOOTER_VARIABLES_LIST_OPTIONS,
  POSITION_OPTIONS,
  SIMPLE_FIELDS,
} from '@/shared/constants/header-footer'
import {
  FileText,
  Images,
  Info,
  Minus,
  Power,
  Ruler,
  Settings2,
  Sparkles,
  SquarePen,
  TextCursorInput,
  Type,
} from 'lucide-react'
import { useState } from 'react'
import { MdRebaseEdit } from 'react-icons/md'
import { RxColumnSpacing } from 'react-icons/rx'

const SlotSimpleConfig = ({ slot, onUpdate }: SlotSimpleConfigProps) => {
  return (
    <div className='space-y-2'>
      {SIMPLE_FIELDS.map((field) => (
        <div
          key={field.value}
          className='bg-primary/10 border-primary space-y-2 rounded-md border p-2'>
          <Label htmlFor={field.value}>
            <div className='bg-primary/20 rounded-[5px] p-1'>
              <field.icon className='h-4 w-4 text-violet-950' />
            </div>
            <span className='text-muted-foreground text-sm font-bold'> {field.label}</span>
          </Label>
          <div className='flex items-center justify-between gap-2'>
            <Input
              id={field.value}
              placeholder={field.placeholder}
              value={(slot[field.value] as string) || ''}
              className='h-9 border-none bg-white text-xs shadow-none outline-none hover:border-none focus:border-none focus:outline-none'
              onChange={(e) => onUpdate({ [field.value]: e.target.value })}
            />
            <VariableSelector
              variables={HEADER_FOOTER_VARIABLES_LIST_OPTIONS}
              onSelect={(v) =>
                onUpdate({
                  [field.value]: (slot[field.value] || '') + v,
                })
              }
            />
          </div>
        </div>
      ))}
    </div>
  )
}
const SlotAdvancedConfig = ({
  slot,
  onUpdate,
  slotType,
  hasFullImage,
  contentType,
  setContentType,
}: SlotAdvancedConfigProps) => {
  return (
    <VisualEditorProvider
      editorConfig={{
        placeholder: 'Digite aqui...',
      }}
      placeholders={HEADER_FOOTER_VARIABLES_LIST_OPTIONS}
      config={{ preset: 'minimal', bubbleMenu: true }}
      initialValue={slot.left || ''}
      updateEditorValue={(html) => onUpdate({ left: html, center: '', right: '' })}>
      <div className='space-y-4'>
        <div className='flex h-10 items-center justify-between gap-1 rounded-md p-1'>
          <div className='bg-primary/50 grid h-10 grid-cols-2 items-center gap-1 rounded-md p-1'>
            <Button
              key='editor'
              variant='ghost'
              size='sm'
              className={cn(
                'border-primary flex h-8 cursor-pointer items-center justify-center border',
                contentType === 'editor'
                  ? 'bg-primary hover:bg-primary text-white hover:text-white'
                  : 'hover:text-primary text-primary bg-white hover:bg-white',
              )}
              onClick={() => setContentType('editor')}>
              <SquarePen className='h-3.5 w-3.5' /> <span className='text-xs'>Editor</span>
            </Button>
            <Button
              key='fullImage'
              variant='ghost'
              size='sm'
              className={cn(
                'border-primary flex h-8 cursor-pointer items-center justify-center border',
                contentType === 'fullImage'
                  ? 'bg-primary hover:bg-primary text-white hover:text-white'
                  : 'hover:text-primary text-primary bg-white hover:bg-white',
              )}
              onClick={() => setContentType('fullImage')}>
              <Images className='h-3.5 w-3.5' /> <span className='text-xs'>Full Image</span>
            </Button>
          </div>
          <ConditionalRender condition={contentType === 'editor'}>
            <ViewModeButtons />
          </ConditionalRender>
        </div>
        <Tabs defaultValue={hasFullImage ? 'fullImage' : 'editor'} value={contentType || 'editor'}>
          <TabsContent value='fullImage'>
            <div className='bg-primary/10 space-y-2 rounded-md p-2'>
              <Label className='text-primary flex w-full gap-2 text-center text-[10px] font-bold'>
                <Images className='h-4 w-4' /> Imagem Completa
              </Label>
              <FullImageUpload
                value={slot.fullImage}
                onChange={async (v) => onUpdate({ fullImage: v || undefined })}
                slotType={slotType}
              />
            </div>
          </TabsContent>
          <TabsContent value='editor'>
            <div className='h-full space-y-2'>
              <VisualEditorComponent editorClassName='max-h-[280px] h-full' />
              <p className='text-muted-foreground flex items-center gap-1.5 px-1 text-[10px]'>
                <Info className='h-3 w-3' /> Use {HEADER_FOOTER_VARIABLES.logo} no editor para
                posicionar o logo onde quiser.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </VisualEditorProvider>
  )
}

export const SlotConfigForm = ({
  slot,
  slotType,
  onUpdate,
  logoValue,
  onLogoChange,
  onResetSlot,
}: SlotConfigFormProps) => {
  const [contentType, setContentType] = useState<'editor' | 'fullImage'>(() =>
    slot.fullImage ? 'fullImage' : 'editor',
  )
  const [mode, setMode] = useState<'simple' | 'advanced'>('advanced')
  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
      <div className='space-y-4 lg:col-span-4'>
        <SectionBox title='Status' icon={Power}>
          <div className='bg-muted/20 flex items-center justify-between rounded-md border p-3'>
            <Label htmlFor={`${slotType}-enabled`} className='text-xs font-bold'>
              Habilitado
            </Label>
            <Switch
              id={`${slotType}-enabled`}
              checked={slot.enabled}
              onCheckedChange={(checked) => onUpdate({ enabled: checked })}
            />
          </div>
        </SectionBox>

        <ConditionalRender condition={slot.enabled}>
          <SectionBox title='Configurações' icon={Settings2}>
            <div className='space-y-4'>
              <div className='bg-primary/10 grid grid-cols-2 gap-3 rounded-md p-2'>
                <div className='space-y-1.5'>
                  <Label className='text-primary text-[10px]'>
                    <Ruler className='h-4 w-4' /> Altura (mm)
                  </Label>
                  <Input
                    className='h-8 border-none bg-white text-xs shadow-none outline-none hover:border-none focus:border-none focus:outline-none'
                    type='number'
                    placeholder='15mm'
                    value={slot.height?.replace('mm', '') || '15'}
                    onChange={(e) => onUpdate({ height: e.target.value + 'mm' })}
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label className='text-primary text-[10px]'>
                    <Type className='h-4 w-4' /> Fonte Base (px)
                  </Label>
                  <Input
                    className='h-8 border-none bg-white text-xs shadow-none outline-none hover:border-none focus:border-none focus:outline-none'
                    type='number'
                    value={slot.fontSize || 11}
                    onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className='bg-primary/10 space-y-2 rounded-md p-2'>
                <Label className='text-primary flex w-full gap-2 text-center text-[10px] font-bold'>
                  <RxColumnSpacing className='h-4 w-4' /> Espaçamento Interno (Paddings)
                </Label>
                <div className='grid grid-cols-4 gap-1'>
                  {POSITION_OPTIONS.map((p) => (
                    <div
                      key={p.value}
                      className='bg-primary/20 flex flex-col items-center gap-1 rounded-[10px] p-1'>
                      <Input
                        type='number'
                        className='h-8 border-none bg-white text-xs shadow-none outline-none hover:border-none focus:border-none focus:outline-none'
                        value={slot.padding?.[p.value]?.replace('mm', '') || '5'}
                        onChange={(e) =>
                          onUpdate({
                            padding: { ...slot.padding, [p.value]: e.target.value + 'mm' },
                          })
                        }
                      />
                      <span className='text-primary flex items-center justify-center gap-1 text-center text-[7px] uppercase'>
                        {p.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <ConditionalRender condition={mode === 'simple' || contentType !== 'fullImage'}>
                <div className='bg-primary/10 space-y-2 rounded-md p-2'>
                  <Label className='text-primary flex w-full gap-2 text-center text-[10px] font-bold'>
                    <Images className='h-4 w-4' /> Logo
                  </Label>
                  <LogoUpload value={logoValue} onChange={onLogoChange} />
                  <ConditionalRender condition={!!logoValue}>
                    <div className='mt-4 grid gap-3 border-t pt-4'>
                      <div className='space-y-1.5'>
                        <Label className='text-[10px]'>Posição (Se sem tag)</Label>
                        <Select
                          value={slot.logo?.position || 'left'}
                          onValueChange={(v: PositionDirection) =>
                            onUpdate({ logo: { ...slot?.logo, position: v } })
                          }>
                          <SelectTrigger className='h-8 text-xs'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='left'>Esquerda</SelectItem>
                            <SelectItem value='center'>Centro</SelectItem>
                            <SelectItem value='right'>Direita</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='space-y-1.5'>
                        <Label className='text-[10px]'>Tamanho</Label>
                        <Select
                          value={slot.logo?.size?.width || '50px'}
                          onValueChange={(v) =>
                            onUpdate({ logo: { ...slot.logo, size: { width: v, height: v } } })
                          }>
                          <SelectTrigger className='h-8 text-xs'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='30px'>Pequeno (30px)</SelectItem>
                            <SelectItem value='50px'>Médio (50px)</SelectItem>
                            <SelectItem value='80px'>Grande (80px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      ConditionalRender
                    </div>
                  </ConditionalRender>
                </div>
              </ConditionalRender>
              <div className='bg-primary/10 flex items-center justify-between rounded-md border p-2'>
                <Label className='text-primary flex w-full gap-2 text-center text-[10px] font-bold'>
                  <Minus className='h-4 w-4' /> Borda Divisória
                </Label>
                <Switch
                  checked={slot.border ?? true}
                  onCheckedChange={(checked) => onUpdate({ border: checked })}
                />
              </div>
            </div>
          </SectionBox>
        </ConditionalRender>
      </div>

      <div className='lg:col-span-8'>
        <ConditionalRender condition={!slot.enabled}>
          <div className='bg-muted/20 flex h-full flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 opacity-40'>
            <FileText className='mb-4 h-12 w-12' />
            <p className='text-sm font-bold'>Este bloco está desativado</p>
            <p className='text-xs'>Ative nas configurações ao lado para editar.</p>
          </div>
        </ConditionalRender>
        <ConditionalRender condition={slot.enabled}>
          <SectionBox
            title='Composição do Conteúdo'
            icon={Sparkles}
            className='h-full'
            additionalContent={
              <ConditionalRender condition={slot.enabled}>
                <div className='space-y-2'>
                  <ToggleGroup
                    type='single'
                    value={mode}
                    onValueChange={(v) => v && setMode(v as any)}
                    className='justify-start gap-2'>
                    <TooltipComponent content={'Simples'}>
                      <ToggleGroupItem value='simple' className='h-8 border px-4 text-xs'>
                        <TextCursorInput className='h-4 w-4' />
                      </ToggleGroupItem>
                    </TooltipComponent>
                    <TooltipComponent content={'Designer'}>
                      <ToggleGroupItem value='advanced' className='h-8 border px-4 text-xs'>
                        <MdRebaseEdit className='h-4 w-4' />
                      </ToggleGroupItem>
                    </TooltipComponent>
                  </ToggleGroup>
                </div>
              </ConditionalRender>
            }>
            <Tabs value={mode}>
              <TabsContent value='advanced'>
                <SlotAdvancedConfig
                  contentType={contentType}
                  setContentType={setContentType}
                  slot={slot}
                  onUpdate={onUpdate}
                  slotType={slotType}
                  hasFullImage={!!slot.fullImage}
                />
              </TabsContent>
              <TabsContent value='simple'>
                <SlotSimpleConfig slot={slot} onUpdate={onUpdate} />
              </TabsContent>
            </Tabs>
          </SectionBox>
        </ConditionalRender>
      </div>
    </div>
  )
}
