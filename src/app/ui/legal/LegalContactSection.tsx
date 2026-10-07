import { CONTACTS } from '@/lib/constants';

interface LegalContactSectionProps {
  sectionNumber?: string | number;
  title?: string;
  introText?: string;
  children?: React.ReactNode;
}

export default function LegalContactSection({
  sectionNumber,
  title = 'Контакти',
  introText,
  children,
}: LegalContactSectionProps) {
  const fullTitle = sectionNumber ? `${sectionNumber}. ${title}` : title;

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-2xl font-semibold">{fullTitle}</h2>
      {introText && <p className="mb-4 text-lg leading-relaxed">{introText}</p>}
      <p className="mb-4 text-lg leading-relaxed">
        Електронна адреса:{' '}
        <a href={`mailto:${CONTACTS.EMAIL}`} className="text-orange-600 hover:underline">
          {CONTACTS.EMAIL}
        </a>
      </p>
      <p className="mb-4 text-lg leading-relaxed">
        Телефони для зв&apos;язку:{' '}
        {CONTACTS.PHONES.map((phone, idx) => (
          <span key={phone.href}>
            {idx > 0 && ', '}
            <a href={phone.href} className="text-orange-600 hover:underline">
              {phone.label}
            </a>
          </span>
        ))}
      </p>
      {children}
    </section>
  );
}
