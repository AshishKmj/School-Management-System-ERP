/**
 * Format number to Indian Currency string (e.g. ₹24,85,500)
 */
export function formatINR(amount: number | undefined | null, showSymbol = true): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return showSymbol ? '₹0' : '0';
  }
  
  // Format to Indian grouping format
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);

  return showSymbol ? `₹${formatted}` : formatted;
}

/**
 * Format date to Indian standard DD/MM/YYYY
 */
export function formatDate(dateStr: string | Date | undefined | null): string {
  if (!dateStr) return '-';
  try {
    const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(d.getTime())) return String(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return String(dateStr);
  }
}

/**
 * Format date to friendly display e.g. "24 Oct, 2027"
 */
export function formatFriendlyDate(dateStr: string | Date | undefined | null): string {
  if (!dateStr) return '-';
  try {
    const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return String(dateStr);
  }
}

/**
 * Format date and time e.g. "24/10/2027 10:42 AM"
 */
export function formatDateTime(dateStr: string | Date | undefined | null): string {
  if (!dateStr) return '-';
  try {
    const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(d.getTime())) return String(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const time = d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return `${day}/${month}/${year} ${time}`;
  } catch {
    return String(dateStr);
  }
}

/**
 * Format time e.g. "10:42 AM"
 */
export function formatTime(dateStr: string | Date | undefined | null): string {
  if (!dateStr) return '-';
  try {
    const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return String(dateStr);
  }
}

/**
 * Generate WhatsApp Click-to-Chat URL with pre-filled message
 */
export function createWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const targetPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Clean phone number display format (+91 XXXXX XXXXX)
 */
export function formatIndianPhone(phone: string): string {
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.length === 10) {
    return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
  }
  if (clean.length === 12 && clean.startsWith('91')) {
    return `+91 ${clean.slice(2, 7)} ${clean.slice(7)}`;
  }
  return phone;
}

/**
 * Convert number to Indian currency words format
 * e.g. 15400 -> "Fifteen Thousand Four Hundred Rupees Only"
 */
export function numberToWordsIndian(num: number): string {
  if (!num || isNaN(num) || num <= 0) return 'Zero Rupees Only';

  const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teenDigits = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tensDigits = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(n: number): string {
    if (n === 0) return '';
    if (n < 10) return singleDigits[n];
    if (n < 20) return teenDigits[n - 10];
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    return `${tensDigits[tens]}${ones > 0 ? ' ' + singleDigits[ones] : ''}`;
  }

  function convertThreeDigits(n: number): string {
    const hundreds = Math.floor(n / 100);
    const rest = n % 100;
    let res = '';
    if (hundreds > 0) {
      res += `${singleDigits[hundreds]} Hundred`;
      if (rest > 0) res += ' ';
    }
    if (rest > 0) {
      res += convertTwoDigits(rest);
    }
    return res;
  }

  let crore = Math.floor(num / 10000000);
  let rem = num % 10000000;
  let lakh = Math.floor(rem / 100000);
  rem = rem % 100000;
  let thousand = Math.floor(rem / 1000);
  let hundred = rem % 1000;

  const parts: string[] = [];

  if (crore > 0) {
    parts.push(`${convertTwoDigits(crore)} Crore`);
  }
  if (lakh > 0) {
    parts.push(`${convertTwoDigits(lakh)} Lakh`);
  }
  if (thousand > 0) {
    parts.push(`${convertTwoDigits(thousand)} Thousand`);
  }
  if (hundred > 0) {
    parts.push(convertThreeDigits(hundred));
  }

  return `${parts.join(' ')} Rupees Only`;
}
