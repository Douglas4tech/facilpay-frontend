import {
  escapeCsvField,
  generateCsv,
  generateExportFileName,
  formatToIso8601,
  isIsoDateString,
} from '../lib/csvExport';
import { ExportColumn } from '../lib/types';

describe('CSV Escaping and Export Specifications (RFC 4180 & ISO 8601)', () => {
  describe('escapeCsvField', () => {
    test('returns empty string for null and undefined', () => {
      expect(escapeCsvField(null)).toBe('');
      expect(escapeCsvField(undefined)).toBe('');
    });

    test('preserves plain alphanumeric strings without special characters', () => {
      expect(escapeCsvField('FacilPay')).toBe('FacilPay');
      expect(escapeCsvField('pay_123456')).toBe('pay_123456');
      expect(escapeCsvField('1250.50')).toBe('1250.50');
    });

    test('properly wraps fields containing commas in double quotes', () => {
      const input = 'Paris, France';
      const output = escapeCsvField(input);
      expect(output).toBe('"Paris, France"');
    });

    test('properly escapes fields containing double quotes by doubling them and enclosing in quotes', () => {
      const input = 'Standard "Enterprise" Plan';
      const output = escapeCsvField(input);
      expect(output).toBe('"Standard ""Enterprise"" Plan"');
    });

    test('properly wraps fields containing newlines (LF and CRLF) in double quotes', () => {
      const inputWithLf = 'First line\nSecond line';
      expect(escapeCsvField(inputWithLf)).toBe('"First line\nSecond line"');

      const inputWithCrlf = 'First line\r\nSecond line';
      expect(escapeCsvField(inputWithCrlf)).toBe('"First line\r\nSecond line"');
    });

    test('properly escapes fields containing commas, quotes, and newlines combined', () => {
      const complexInput = 'Item 1: "Widget", Item 2: "Gadget"\nDelivery: Urgent';
      const expected = '"Item 1: ""Widget"", Item 2: ""Gadget""\nDelivery: Urgent"';
      expect(escapeCsvField(complexInput)).toBe(expected);
    });

    test('formats Date objects as standard ISO 8601 strings', () => {
      const date = new Date('2026-01-15T14:32:00.000Z');
      expect(escapeCsvField(date)).toBe('2026-01-15T14:32:00.000Z');
    });

    test('preserves valid ISO 8601 string dates without alteration', () => {
      const isoStr = '2026-01-15T14:32:00.000Z';
      expect(escapeCsvField(isoStr)).toBe(isoStr);
    });
  });

  describe('isIsoDateString & formatToIso8601', () => {
    test('accurately identifies ISO 8601 date strings', () => {
      expect(isIsoDateString('2026-01-15T14:32:00.000Z')).toBe(true);
      expect(isIsoDateString('2026-01-15')).toBe(true);
      expect(isIsoDateString('Not a date')).toBe(false);
      expect(isIsoDateString('12345')).toBe(false);
    });

    test('formats dates and valid strings to ISO 8601', () => {
      const date = new Date('2026-01-20T10:00:00.000Z');
      expect(formatToIso8601(date)).toBe('2026-01-20T10:00:00.000Z');
      expect(formatToIso8601(null)).toBe('');
    });
  });

  describe('generateExportFileName', () => {
    test('generates expected filename with explicit start and end dates', () => {
      const fileName = generateExportFileName(
        'payments',
        '2026-01-01',
        '2026-01-31'
      );
      expect(fileName).toBe('facilpay-payments-2026-01-01_2026-01-31.csv');
    });

    test('generates refunds and payouts file names matching the specification', () => {
      expect(
        generateExportFileName('refunds', '2026-02-01', '2026-02-28')
      ).toBe('facilpay-refunds-2026-02-01_2026-02-28.csv');

      expect(
        generateExportFileName('payouts', '2026-03-01', '2026-03-31')
      ).toBe('facilpay-payouts-2026-03-01_2026-03-31.csv');
    });

    test('derives min and max dates from dataset when filters are null', () => {
      const dataset = [
        { date: '2026-01-10T12:00:00.000Z' },
        { date: '2026-01-25T15:30:00.000Z' },
        { date: '2026-01-05T08:00:00.000Z' },
      ];
      const fileName = generateExportFileName('payments', null, null, dataset);
      expect(fileName).toBe('facilpay-payments-2026-01-05_2026-01-25.csv');
    });
  });

  describe('generateCsv and Column Selection', () => {
    interface TestItem {
      id: string;
      amount: number;
      customer: string;
      notes: string;
      date: string;
    }

    const testData: TestItem[] = [
      {
        id: 'pay_001',
        amount: 500.0,
        customer: 'Alice, Smith',
        notes: 'Includes 10% "early bird" discount',
        date: '2026-01-15T12:00:00.000Z',
      },
      {
        id: 'pay_002',
        amount: 1200.5,
        customer: 'Bob Jones',
        notes: 'Monthly renewal\nPayment 2 of 12',
        date: '2026-01-16T14:30:00.000Z',
      },
    ];

    const columns: ExportColumn<TestItem>[] = [
      { key: 'id', label: 'Payment ID', selected: true },
      { key: 'amount', label: 'Amount', selected: true, formatter: (v) => Number(v).toFixed(2) },
      { key: 'customer', label: 'Customer Name', selected: true },
      { key: 'notes', label: 'Transaction Notes', selected: true },
      { key: 'date', label: 'Date', selected: false }, // Unselected column
    ];

    test('generates headers only for selected columns', () => {
      const csv = generateCsv(testData, columns);
      const headerLine = csv.split('\r\n')[0];
      expect(headerLine).toBe('Payment ID,Amount,Customer Name,Transaction Notes');
      expect(headerLine).not.toContain('Date');
    });

    test('omits unselected columns from data rows', () => {
      const csv = generateCsv(testData, columns);
      const rows = csv.split('\r\n');
      expect(rows.length).toBe(3); // 1 header + 2 data rows

      // Row 1 checks
      expect(rows[1]).toContain('pay_001,500.00,"Alice, Smith","Includes 10% ""early bird"" discount"');
      expect(rows[1]).not.toContain('2026-01-15T12:00:00.000Z');

      // Row 2 checks (multiline escaping)
      expect(rows[2]).toContain('pay_002,1200.50,Bob Jones,"Monthly renewal\nPayment 2 of 12"');
    });

    test('returns empty string if no columns are selected', () => {
      const allUnselected = columns.map((c) => ({ ...c, selected: false }));
      const csv = generateCsv(testData, allUnselected);
      expect(csv).toBe('');
    });
  });
});
