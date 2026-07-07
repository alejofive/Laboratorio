import EstadoBadge from '@/components/EstadoBadge'
import { Button } from '@/components/ui/Button'
import {
  CheckboxInput,
  FieldLabel,
  RadioInput,
  SelectInput,
  TextareaInput,
  TextInput,
} from '@/components/ui/FormField'
import { Check, FileText, Mail, Plus } from 'lucide-react'

const colors = [
  { name: 'Canvas', className: 'bg-canvas', token: 'bg-canvas', hex: '#f9fafc' },
  { name: 'Surface', className: 'bg-surface', token: 'bg-surface', hex: '#ffffff' },
  { name: 'Surface muted', className: 'bg-surface-muted', token: 'bg-surface-muted', hex: '#f1f5f9' },
  { name: 'Primary text', className: 'bg-primary', token: 'text-primary', hex: '#1c293d' },
  { name: 'Secondary text', className: 'bg-secondary', token: 'text-secondary', hex: '#89868d' },
  { name: 'Tertiary text', className: 'bg-tertiary', token: 'text-tertiary', hex: '#545454' },
  { name: 'Brand primary', className: 'bg-brand-primary', token: 'bg-brand-primary', hex: '#0058a8' },
  { name: 'Brand active', className: 'bg-brand-active', token: 'bg-brand-active', hex: '#e4f4fc' },
  { name: 'Brand logo', className: 'bg-brand-logo', token: 'text-brand-logo', hex: '#ea4031' },
  { name: 'Success', className: 'bg-success', token: 'bg-success', hex: '#009966' },
  { name: 'Success soft', className: 'bg-success-soft', token: 'bg-success-soft', hex: '#dcffef' },
  { name: 'Border default', className: 'bg-border-default', token: 'border-border-default', hex: '#e4e4e4' },
  { name: 'Border input', className: 'bg-border-input', token: 'border-border-input', hex: '#dbdcde' },
]

const typeSamples = [
  { name: 'Page title', className: 'text-3xl font-bold text-primary', sample: 'Plantillas de examenes' },
  { name: 'Section title', className: 'text-xl font-semibold text-primary', sample: 'Nuevo paciente' },
  { name: 'Body', className: 'text-base text-tertiary', sample: 'Texto principal usado en formularios y tablas.' },
  { name: 'Secondary', className: 'text-sm text-secondary', sample: 'Texto auxiliar, descripciones y metadatos.' },
  { name: 'Label', className: 'text-sm font-medium text-tertiary', sample: 'Fecha del examen' },
  { name: 'Eyebrow', className: 'text-xs font-bold uppercase tracking-[0.18em] text-brand-primary', sample: 'Administracion' },
]

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className='rounded-3xl border border-border-default bg-surface p-6'>
      <div className='mb-5'>
        <h2 className='text-xl font-semibold text-primary'>{title}</h2>
        <p className='mt-1 text-sm text-secondary'>{description}</p>
      </div>
      {children}
    </section>
  )
}

function FieldDemo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </div>
  )
}

export default function UiKitPage() {
  return (
    <main className='min-h-screen w-full px-8 py-8'>
      <div className='mx-auto max-w-7xl space-y-6'>
        <header className='rounded-3xl border border-border-default bg-surface p-6'>
          <p className='text-xs font-bold uppercase tracking-[0.18em] text-brand-primary'>Design system</p>
          <div className='mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-primary'>UI Kit Laboratorio</h1>
              <p className='mt-2 max-w-3xl text-base text-secondary'>
                Vista de referencia para colores, tipografia, botones, inputs, estados y patrones de UI. Si un componente cambia, esta pagina debe cambiar tambien.
              </p>
            </div>
            <div className='rounded-2xl bg-brand-active px-4 py-3 text-sm font-medium text-brand-primary'>
              Fuente: Tailwind v4 + componentes compartidos
            </div>
          </div>
        </header>

        <Section title='Colores' description='Tokens definidos en src/app/globals.css dentro de :root y @theme.'>
          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
            {colors.map(color => (
              <article key={color.name} className='overflow-hidden rounded-2xl border border-border-default bg-white'>
                <div className={`h-20 ${color.className}`} />
                <div className='p-4'>
                  <h3 className='font-semibold text-primary'>{color.name}</h3>
                  <p className='mt-1 text-sm text-secondary'>{color.token}</p>
                  <p className='mt-1 font-mono text-xs text-tertiary'>{color.hex}</p>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section title='Tipografia' description='Escala real usada en titulos, labels, texto base y ayudas.'>
          <div className='grid gap-4 lg:grid-cols-2'>
            {typeSamples.map(item => (
              <article key={item.name} className='rounded-2xl border border-border-default bg-white p-4'>
                <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-secondary'>{item.name}</p>
                <p className={item.className}>{item.sample}</p>
                <p className='mt-2 font-mono text-xs text-secondary'>{item.className}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section title='Botones' description='Solo existen 3 variantes de producto: primary, outline y link.'>
          <div className='space-y-5'>
            <div className='flex flex-wrap items-center gap-3'>
              <Button icon={<Plus className='h-5 w-5' />}>Primary</Button>
              <Button variant='outline' icon={<FileText className='h-5 w-5' />}>Outline</Button>
              <Button variant='link' icon={<Mail className='h-4 w-4' />}>Link</Button>
            </div>
            <div className='flex flex-wrap items-center gap-3'>
              <Button size='sm'>Small</Button>
              <Button size='md'>Medium</Button>
              <Button size='lg'>Large</Button>
              <Button disabled>Disabled</Button>
              <Button loading>Cargando</Button>
            </div>
          </div>
        </Section>

        <Section title='Inputs y formularios' description='Todos los controles salen de src/components/ui/FormField.tsx.'>
          <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
            <FieldDemo label='Input text'>
              <TextInput placeholder='Nombre del paciente' defaultValue='Mario Perez' />
            </FieldDemo>
            <FieldDemo label='Input numerico'>
              <TextInput inputMode='decimal' placeholder='0.00' defaultValue='12.5' />
              <p className='mt-1 text-xs text-secondary'>Usar type text + inputMode decimal para evitar flechas nativas.</p>
            </FieldDemo>
            <FieldDemo label='Select'>
              <SelectInput defaultValue='hematologia'>
                <option value=''>Seleccionar</option>
                <option value='hematologia'>Hematologia</option>
                <option value='quimica'>Quimica</option>
                <option value='orina'>Orina</option>
              </SelectInput>
            </FieldDemo>
            <FieldDemo label='Textarea'>
              <TextareaInput placeholder='Observaciones de la solicitud' defaultValue='Paciente en ayuno.' />
            </FieldDemo>
            <div>
              <FieldLabel>Checkbox</FieldLabel>
              <div className='space-y-3 rounded-2xl border border-border-default bg-white p-4'>
                <CheckboxInput defaultChecked label='Paciente seleccionado' />
                <CheckboxInput label='Enviar copia por correo' />
              </div>
            </div>
            <div>
              <FieldLabel>Radio</FieldLabel>
              <div className='space-y-3 rounded-2xl border border-border-default bg-white p-4'>
                <RadioInput name='ui-kit-status' defaultChecked label='Pendiente' />
                <RadioInput name='ui-kit-status' label='Completado' />
              </div>
            </div>
            <FieldDemo label='Error'>
              <TextInput error placeholder='Campo requerido' />
              <p className='mt-1 text-xs text-red-500'>Este campo es obligatorio.</p>
            </FieldDemo>
            <FieldDemo label='Disabled'>
              <TextInput disabled defaultValue='Valor bloqueado' />
            </FieldDemo>
          </div>
        </Section>

        <Section title='Estados y badges' description='Estados actuales de examenes y solicitudes.'>
          <div className='flex flex-wrap gap-3'>
            <EstadoBadge estado='pendiente' />
            <EstadoBadge estado='en_proceso' />
            <EstadoBadge estado='completo' />
            <EstadoBadge estado='enviado' />
            <span className='inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1 text-xs font-medium text-success'>
              <Check className='h-3 w-3' /> Activo
            </span>
          </div>
        </Section>

        <Section title='Cards y tablas' description='Patrones base para superficies, listas y datos tabulares.'>
          <div className='grid gap-5 lg:grid-cols-[1fr_1.2fr]'>
            <article className='rounded-3xl border border-border-default bg-surface p-5'>
              <p className='text-xs font-bold uppercase tracking-[0.18em] text-brand-primary'>Paciente</p>
              <h3 className='mt-2 text-xl font-semibold text-primary'>Mario Perez</h3>
              <p className='mt-1 text-sm text-secondary'>V-12345678 · 32 años · 0414-0000000</p>
              <div className='mt-4 flex flex-wrap gap-2'>
                <span className='rounded-full bg-brand-active px-3 py-1 text-xs font-medium text-brand-primary'>Hematologia</span>
                <span className='rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-secondary'>Quimica</span>
              </div>
            </article>
            <div className='overflow-hidden rounded-3xl border border-border-default bg-surface'>
              <table className='w-full'>
                <thead className='border-b border-border-default bg-surface-muted'>
                  <tr>
                    <th className='px-4 py-3 text-left text-sm font-medium text-secondary'>Examen</th>
                    <th className='px-4 py-3 text-left text-sm font-medium text-secondary'>Resultado</th>
                    <th className='px-4 py-3 text-left text-sm font-medium text-secondary'>Referencia</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border-default'>
                  <tr>
                    <td className='px-4 py-3 text-sm font-medium text-tertiary'>Eritrocitos</td>
                    <td className='px-4 py-3 text-sm font-semibold text-primary'>3.5</td>
                    <td className='px-4 py-3 text-sm text-secondary'>3.50 - 5.50</td>
                  </tr>
                  <tr>
                    <td className='px-4 py-3 text-sm font-medium text-tertiary'>Hemoglobina</td>
                    <td className='px-4 py-3 text-sm font-semibold text-primary'>12</td>
                    <td className='px-4 py-3 text-sm text-secondary'>Adultos 12 - 18</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Section>
      </div>
    </main>
  )
}
