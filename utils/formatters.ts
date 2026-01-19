import { Gender, BloodType, MaritalStatus } from '@/types/backend';

export const formatGender = (gender?: Gender): string => {
  if (gender === undefined) return '-';
  switch (gender) {
    case Gender.Male:
      return 'Erkek';
    case Gender.Female:
      return 'Kadın';
    default:
      return '-';
  }
};

export const formatBloodType = (bloodType?: BloodType): string => {
  if (bloodType === undefined) return '-';
  switch (bloodType) {
    case BloodType.APositive:
      return 'A+';
    case BloodType.ANegative:
      return 'A-';
    case BloodType.BPositive:
      return 'B+';
    case BloodType.BNegative:
      return 'B-';
    case BloodType.ABPositive:
      return 'AB+';
    case BloodType.ABNegative:
      return 'AB-';
    case BloodType.OPositive:
      return '0+';
    case BloodType.ONegative:
      return '0-';
    default:
      return '-';
  }
};

export const formatMaritalStatus = (status?: MaritalStatus): string => {
  if (status === undefined) return '-';
  switch (status) {
    case MaritalStatus.Single:
      return 'Bekar';
    case MaritalStatus.Married:
      return 'Evli';
    case MaritalStatus.Divorced:
      return 'Boşanmış';
    case MaritalStatus.Widowed:
      return 'Dul';
    default:
      return '-';
  }
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

export const formatPhone = (phone?: string): string => {
  if (!phone) return '-';

  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`;
  }

  return phone;
};

export const parseDateToISO = (dateString: string): string => {
  if (!dateString) return '';

  if (dateString.includes('.')) {
    const parts = dateString.split('.');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
  }

  if (dateString.includes('-') && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString;
  }

  return dateString;
};

const CDN_BASE_URL = 'https://faz2-cdn.herotr.com';

export const normalizePhotoUrl = (photoUrl?: string | null): string | null => {
  if (!photoUrl) return null;

  if (photoUrl === CDN_BASE_URL) return null;

  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }

  if (photoUrl.startsWith('/')) {
    return `${CDN_BASE_URL}${photoUrl}`;
  }

  return `${CDN_BASE_URL}/${photoUrl}`;
};
