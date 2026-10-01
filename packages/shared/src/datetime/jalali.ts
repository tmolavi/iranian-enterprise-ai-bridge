/**
 * High-precision Jalali (Solar Hijri / تقویم شمسی) date conversion and calendar math.
 * Zero external dependencies, supports standard Iranian ERP string and integer formats.
 */

export interface JalaliDate {
  jy: number;
  jm: number;
  jd: number;
}

export interface GregorianDate {
  gy: number;
  gm: number;
  gd: number;
}

export class JalaliDateTime {
  public static readonly MONTH_NAMES_FA = [
    'فروردین', 'اردیبهشت', 'خرداد',
    'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر',
    'دی', 'بهمن', 'اسفند'
  ];

  public static readonly MONTH_NAMES_EN = [
    'Farvardin', 'Ordibehesht', 'Khordad',
    'Tir', 'Mordad', 'Shahrivar',
    'Mehr', 'Aban', 'Azar',
    'Dey', 'Bahman', 'Esfand'
  ];

  /**
   * Check if a Jalali year is leap year (سال کبیسه).
   */
  public static isLeapJalaliYear(jy: number): boolean {
    return this.jalaliCal(jy).leap === 0;
  }

  /**
   * Internal algorithm for Jalali calendar breaks (33-year cycle algorithm).
   */
  private static jalaliCal(jy: number) {
    const breaks = [
      -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210,
      1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
    ];
    const bl = breaks.length;
    const gy = jy + 621;
    let leapJ = -14;
    let jp = breaks[0];
    let jm: number;
    let jump: number;
    let n: number;
    let i: number;

    if (jy < jp || jy >= breaks[bl - 1]) {
      throw new Error(`Invalid Jalali year: ${jy}`);
    }

    for (i = 1; i < bl; i += 1) {
      jm = breaks[i];
      jump = jm - jp;
      if (jy < jm) break;
      leapJ = leapJ + Math.floor(jump / 33) * 8 + Math.floor(((jump % 33) + 3) / 4);
      jp = jm;
    }

    n = jy - jp;
    leapJ = leapJ + Math.floor(n / 33) * 8 + Math.floor(((n % 33) + 3) / 4);
    if ((jump! % 33) === 4 && jump! - n === 4) {
      leapJ += 1;
    }

    const leapG = Math.floor(gy / 4) - Math.floor(((Math.floor(gy / 100) + 1) * 3) / 4) - 150;
    const march = 20 + (leapJ - leapG);

    let leap = (jump! - n) % 33;
    if (leap === -1) leap = 4;

    return {
      leap: leap,
      gy: gy,
      march: march
    };
  }

  /**
   * Convert Gregorian date to Jalali date.
   */
  public static toJalali(gy: number, gm: number, gd: number): JalaliDate {
    const gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const isGLeap = (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0;
    if (isGLeap) gDaysInMonth[1] = 29;

    let gy2 = gy - 1600;
    let gm2 = gm - 1;
    let gd2 = gd - 1;

    let gDayNo = 365 * gy2 + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400);

    for (let i = 0; i < gm2; ++i) {
      gDayNo += gDaysInMonth[i];
    }
    gDayNo += gd2;

    let jDayNo = gDayNo - 79;
    let jNp = Math.floor(jDayNo / 12053);
    jDayNo %= 12053;

    let jy = 979 + 33 * jNp + 4 * Math.floor(jDayNo / 1461);
    jDayNo %= 1461;

    if (jDayNo >= 366) {
      jy += Math.floor((jDayNo - 1) / 365);
      jDayNo = (jDayNo - 1) % 365;
    }

    let jm = 0;
    let jd = 0;
    if (jDayNo < 186) {
      jm = 1 + Math.floor(jDayNo / 31);
      jd = 1 + (jDayNo % 31);
    } else {
      jm = 7 + Math.floor((jDayNo - 186) / 30);
      jd = 1 + ((jDayNo - 186) % 30);
    }

    return { jy, jm, jd };
  }

  /**
   * Convert Jalali date to Gregorian date.
   */
  public static toGregorian(jy: number, jm: number, jd: number): GregorianDate {
    let jDayNo = 0;
    const jDaysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    if (this.isLeapJalaliYear(jy)) {
      jDaysInMonth[11] = 30;
    }

    const jy2 = jy - 979;
    const jm2 = jm - 1;
    const jd2 = jd - 1;

    let dayNo = 365 * jy2 + Math.floor(jy2 / 33) * 8 + Math.floor(((jy2 % 33) + 3) / 4);
    for (let i = 0; i < jm2; ++i) {
      dayNo += jDaysInMonth[i];
    }
    dayNo += jd2;

    let gDayNo = dayNo + 79;
    let gy = 1600 + 400 * Math.floor(gDayNo / 146097);
    gDayNo %= 146097;

    let leap = true;
    if (gDayNo >= 36525) {
      gDayNo--;
      gy += 100 * Math.floor(gDayNo / 36524);
      gDayNo %= 36524;

      if (gDayNo >= 365) {
        gDayNo++;
      } else {
        leap = false;
      }
    }

    gy += 4 * Math.floor(gDayNo / 1461);
    gDayNo %= 1461;

    if (gDayNo >= 366) {
      leap = false;
      gDayNo--;
      gy += Math.floor(gDayNo / 365);
      gDayNo %= 365;
    }

    const gDaysInMonth = [31, (leap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let gm = 0;
    while (gDayNo >= gDaysInMonth[gm]) {
      gDayNo -= gDaysInMonth[gm];
      gm++;
    }

    return {
      gy,
      gm: gm + 1,
      gd: gDayNo + 1
    };
  }

  /**
   * Format a JavaScript Date to standard Jalali string: YYYY/MM/DD
   */
  public static format(date: Date, delimiter = '/'): string {
    const j = this.toJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const mm = j.jm.toString().padStart(2, '0');
    const dd = j.jd.toString().padStart(2, '0');
    return `${j.jy}${delimiter}${mm}${delimiter}${dd}`;
  }

  /**
   * Parse Jalali string (YYYY/MM/DD, YYYY-MM-DD, or YYYYMMDD) to JS Date.
   */
  public static parse(jalaliStr: string): Date {
    const clean = jalaliStr.replace(/[^\d]/g, '');
    if (clean.length !== 8) {
      throw new Error(`Invalid Jalali date format: "${jalaliStr}". Expected YYYY/MM/DD or YYYYMMDD.`);
    }

    const jy = parseInt(clean.substring(0, 4), 10);
    const jm = parseInt(clean.substring(4, 6), 10);
    const jd = parseInt(clean.substring(6, 8), 10);

    const g = this.toGregorian(jy, jm, jd);
    return new Date(Date.UTC(g.gy, g.gm - 1, g.gd));
  }

  /**
   * Return Jalali Quarter (1..4) and Fiscal Year for a date.
   */
  public static getJalaliQuarter(date: Date): { year: number; quarter: number; quarterNameFa: string } {
    const j = this.toJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const quarter = Math.ceil(j.jm / 3);
    const qNames = ['بهار (سه ماهه اول)', 'تابستان (سه ماهه دوم)', 'پاییز (سه ماهه سوم)', 'زمستان (سه ماهه چهارم)'];
    return {
      year: j.jy,
      quarter,
      quarterNameFa: `فصل ${qNames[quarter - 1]} ${j.jy}`
    };
  }
}
