import { Gender, BloodType, MaritalStatus, EducationLevel, MilitaryStatus } from '@/types/backend';

export function formatGender(gender?: Gender): string {
  if (gender === undefined || gender === null) return '-';

  const genderMap = {
    [Gender.Male]: 'Erkek',
    [Gender.Female]: 'Kadın',
  };

  return genderMap[gender] || '-';
}

export function formatBloodType(bloodType?: BloodType): string {
  if (bloodType === undefined || bloodType === null) return '-';

  const bloodTypeMap = {
    [BloodType.APositive]: 'A Rh+',
    [BloodType.ANegative]: 'A Rh-',
    [BloodType.BPositive]: 'B Rh+',
    [BloodType.BNegative]: 'B Rh-',
    [BloodType.ABPositive]: 'AB Rh+',
    [BloodType.ABNegative]: 'AB Rh-',
    [BloodType.OPositive]: '0 Rh+',
    [BloodType.ONegative]: '0 Rh-',
  };

  return bloodTypeMap[bloodType] || '-';
}

export function formatMaritalStatus(status?: MaritalStatus): string {
  if (status === undefined || status === null) return '-';

  const statusMap = {
    [MaritalStatus.Single]: 'Bekar',
    [MaritalStatus.Married]: 'Evli',
    [MaritalStatus.Divorced]: 'Boşanmış',
    [MaritalStatus.Widowed]: 'Dul',
  };

  return statusMap[status] || '-';
}

export function formatEducationLevel(level?: EducationLevel): string {
  if (level === undefined || level === null) return '-';

  const levelMap = {
    [EducationLevel.PrimarySchool]: 'İlkokul',
    [EducationLevel.MiddleSchool]: 'Ortaokul',
    [EducationLevel.HighSchool]: 'Lise',
    [EducationLevel.AssociateDegree]: 'Ön Lisans',
    [EducationLevel.BachelorDegree]: 'Lisans',
    [EducationLevel.MasterDegree]: 'Yüksek Lisans',
    [EducationLevel.Doctorate]: 'Doktora',
  };

  return levelMap[level] || '-';
}

export function formatMilitaryStatus(status?: MilitaryStatus): string {
  if (status === undefined || status === null) return '-';

  const statusMap = {
    [MilitaryStatus.Completed]: 'Yapıldı',
    [MilitaryStatus.Postponed]: 'Tecilli',
    [MilitaryStatus.Exempt]: 'Muaf',
    [MilitaryStatus.NotApplicable]: 'Yükümlü Değil',
  };

  return statusMap[status] || '-';
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '-';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '-';
  }
}

export function formatPhone(phone?: string): string {
  if (!phone) return '-';

  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return `0 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
  }

  return phone;
}
