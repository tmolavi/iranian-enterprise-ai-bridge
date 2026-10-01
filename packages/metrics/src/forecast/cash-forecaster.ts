import { IranianCurrencyFormatter, PersianNormalizer } from '@ieab/shared';

export interface CashForecastPoint {
  dateJalali: string;
  projectedInflowRial: number;
  projectedOutflowRial: number;
  netCashFlowRial: number;
  closingBalanceRial: number;
  confidenceLowerBoundRial: number;
  confidenceUpperBoundRial: number;
}

export interface ExecutiveCashForecastReport {
  currentCashPositionRial: number;
  currentCashPositionFormattedFa: string;
  projected30DaysClosingRial: number;
  projected30DaysClosingFormattedFa: string;
  minimumCashThresholdRial: number;
  minimumProjectedDateJalali?: string;
  runwayStatus: 'HEALTHY' | 'TIGHT' | 'DEFICIT_RISK';
  runwayStatusFa: string;
  forecastPoints: CashForecastPoint[];
}

export class CashForecaster {
  public static forecast30Days(currentBalanceRial: number): ExecutiveCashForecastReport {
    const points: CashForecastPoint[] = [];
    let runningBalance = currentBalanceRial;
    const minThreshold = 2_000_000_000_0; // 2 Billion Tomans minimum reserve

    const dates = [
      '1403/07/15', '1403/07/20', '1403/07/25', '1403/07/28', '1403/07/30',
      '1403/08/05', '1403/08/10', '1403/08/15'
    ];

    const flows = [
      { in: 800_000_000_0, out: 300_000_000_0 },  // 15th
      { in: 1_200_000_000_0, out: 600_000_000_0 }, // 20th
      { in: 500_000_000_0, out: 1_100_000_000_0 }, // 25th
      { in: 400_000_000_0, out: 2_400_000_000_0 }, // 28th (Payroll & Tax)
      { in: 1_500_000_000_0, out: 700_000_000_0 }, // 30th
      { in: 900_000_000_0, out: 400_000_000_0 },   // 5th
      { in: 1_100_000_000_0, out: 500_000_000_0 }, // 10th
      { in: 800_000_000_0, out: 400_000_000_0 }    // 15th
    ];

    let minDate: string | undefined;

    for (let i = 0; i < dates.length; i++) {
      const { in: inf, out: outf } = flows[i];
      const net = inf - outf;
      runningBalance += net;

      if (runningBalance < minThreshold && !minDate) {
        minDate = dates[i];
      }

      points.push({
        dateJalali: dates[i],
        projectedInflowRial: inf,
        projectedOutflowRial: outf,
        netCashFlowRial: net,
        closingBalanceRial: runningBalance,
        confidenceLowerBoundRial: runningBalance * 0.9,
        confidenceUpperBoundRial: runningBalance * 1.1
      });
    }

    const lastPoint = points[points.length - 1];
    const isDeficit = runningBalance < minThreshold;

    return {
      currentCashPositionRial: currentBalanceRial,
      currentCashPositionFormattedFa: IranianCurrencyFormatter.formatExecutive(currentBalanceRial, 'TOMAN').humanReadableFa,
      projected30DaysClosingRial: lastPoint.closingBalanceRial,
      projected30DaysClosingFormattedFa: IranianCurrencyFormatter.formatExecutive(lastPoint.closingBalanceRial, 'TOMAN').humanReadableFa,
      minimumCashThresholdRial: minThreshold,
      minimumProjectedDateJalali: minDate,
      runwayStatus: isDeficit ? 'DEFICIT_RISK' : 'HEALTHY',
      runwayStatusFa: isDeficit ? 'ریسک کسری نقدینگی در پایان ماه' : 'وضعیت نقدینگی پایدار',
      forecastPoints: points
    };
  }
}
