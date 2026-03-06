import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type CaseStatus = 'OPEN' | 'CLOSED' | 'STAY' | 'ON_HOLD';

interface CaseItem {
  clientType: string;
  id: number;
  fileNo: string;
  caseNo: string;
  caseTitle: string;
  partyRepresent: string;
  caseType: string;
  courtName: string;
  city: string;

  handledByName: string;
  handledByPhone: string;
  handledByAddress: string;
  handledByEmail?: string;

  nextHearingDate?: string; // yyyy-mm-dd
  fixedFor?: string;

  status: CaseStatus;
  createdAt: string; // yyyy-mm-dd
}

interface FinanceEntry {
  id: number;
  date: string; // yyyy-mm-dd
  type: 'INCOME' | 'EXPENSE';
  title: string;
  amount: number;
  note?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
})
export class AppComponent {
  // -------- Tabs --------
  activeTab: 'dashboard' | 'new' | 'calendar' | 'finance' = 'dashboard';

  // -------- Demo data --------
  cases: CaseItem[] = [
    {
      clientType: 'Individual',
      id: 1,
      fileNo: 'F-1001',
      caseNo: 'CN-01/2026',
      caseTitle: 'Rajput vs Sharma (Property Dispute)',
      partyRepresent: 'Plaintiff',
      caseType: 'Civil',
      courtName: 'District Court',
      city: 'Raipur',
      handledByName: 'Adv. Yograj',
      handledByPhone: '9999999999',
      handledByAddress: 'Tikrapara',
      handledByEmail: 'adv@example.com',
      nextHearingDate: this.todayPlusDays(2),
      fixedFor: 'Evidence',
      status: 'OPEN',
      createdAt: this.todayISO(),
    },
    {
      clientType: 'Individual',
      id: 2,
      fileNo: 'F-1002',
      caseNo: 'CN-02/2026',
      caseTitle: 'ABC Corp vs XYZ Ltd (Contract)',
      partyRepresent: 'Defendant',
      caseType: 'Corporate',
      courtName: 'High Court',
      city: 'Bilaspur',
      handledByName: 'Adv. Yograj',
      handledByPhone: '9999999999',
      handledByAddress: 'Tikrapara',
      status: 'ON_HOLD',
      createdAt: this.todayPlusDays(-5),
      nextHearingDate: this.todayPlusDays(10),
      fixedFor: 'Arguments',
    },
  ];

  // -------- Search & Filters --------
  searchText = '';
  statusFilter: CaseStatus | 'ALL' = 'ALL';
  upcomingOnly = false;

  // Selected date for dashboard count + calendar
  selectedDate = this.todayISO(); // yyyy-mm-dd

  // -------- New Case Form Model --------
  caseModel: Omit<CaseItem, 'id'> = this.emptyCaseModel();

  // For edit mode
  editingId: number | null = null;

  // -------- Finance --------
  financeEntries: FinanceEntry[] = [
    { id: 1, date: this.todayISO(), type: 'INCOME', title: 'Consultation Fee', amount: 1500, note: 'Cash' },
    { id: 2, date: this.todayISO(), type: 'EXPENSE', title: 'Printing', amount: 200, note: 'Court docs' },
  ];

  financeModel: Omit<FinanceEntry, 'id'> = {
    date: this.todayISO(),
    type: 'INCOME',
    title: '',
    amount: 0,
    note: '',
  };

  // -------- Calendar state --------
  calYear = new Date().getFullYear();
  calMonth = new Date().getMonth(); // 0-11

  // ===================== UI Actions =====================

  setTab(tab: typeof this.activeTab) {
    this.activeTab = tab;
  }

  onSelectDate(dateISO: string) {
    this.selectedDate = dateISO;
  }

  // -------- Case CRUD --------
  saveCase() {
    // Basic validation
    if (!this.caseModel.fileNo.trim() || !this.caseModel.caseTitle.trim()) {
      alert('File No and Case Title are required.');
      return;
    }

    if (this.editingId === null) {
      const newCase: CaseItem = {
        ...this.caseModel,
        id: this.nextId(this.cases.map(c => c.id)),
      };
      this.cases.unshift(newCase);
    } else {
      const idx = this.cases.findIndex(c => c.id === this.editingId);
      if (idx >= 0) {
        this.cases[idx] = { ...this.caseModel, id: this.editingId };
      }
      this.editingId = null;
    }

    this.caseModel = this.emptyCaseModel();
    this.activeTab = 'dashboard';
  }

  editCase(item: CaseItem) {
    this.editingId = item.id;
    const { id, ...rest } = item;
    this.caseModel = { ...rest };
    this.activeTab = 'new';
  }

  deleteCase(id: number) {
    const ok = confirm('Delete this case?');
    if (!ok) return;
    this.cases = this.cases.filter(c => c.id !== id);
  }

  cancelEdit() {
    this.editingId = null;
    this.caseModel = this.emptyCaseModel();
  }

  // -------- Search min 3 chars (case title) --------
  get isSearchActive(): boolean {
    return this.searchText.trim().length >= 3;
  }

  get filteredCases(): CaseItem[] {
    let list = [...this.cases];

    // Status filter
    if (this.statusFilter !== 'ALL') {
      list = list.filter(c => c.status === this.statusFilter);
    }

    // Upcoming filter
    if (this.upcomingOnly) {
      const today = this.todayISO();
      list = list.filter(c => (c.nextHearingDate || '') >= today);
    }

    // Search min 3 chars (Case Title)
    const q = this.searchText.trim().toLowerCase();
    if (q.length > 0 && q.length < 3) {
      // rule: do not search <3 chars; return unsearched list
      return list;
    }
    if (q.length >= 3) {
      list = list.filter(c => c.caseTitle.toLowerCase().includes(q));
    }

    return list;
  }

  // -------- Cases count for a particular date --------
  get casesOnSelectedDateCount(): number {
    const d = this.selectedDate;
    return this.cases.filter(c => c.nextHearingDate === d).length;
  }

  get casesOnSelectedDate(): CaseItem[] {
    const d = this.selectedDate;
    return this.cases.filter(c => c.nextHearingDate === d);
  }

  // -------- Finance CRUD + totals --------
  addFinanceEntry() {
    if (!this.financeModel.title.trim() || !this.financeModel.date) {
      alert('Finance title and date are required.');
      return;
    }
    if (this.financeModel.amount <= 0) {
      alert('Amount must be > 0');
      return;
    }

    const entry: FinanceEntry = {
      ...this.financeModel,
      id: this.nextId(this.financeEntries.map(e => e.id)),
      amount: Number(this.financeModel.amount),
    };
    this.financeEntries.unshift(entry);
    this.financeModel = { date: this.todayISO(), type: 'INCOME', title: '', amount: 0, note: '' };
  }

  deleteFinanceEntry(id: number) {
    const ok = confirm('Delete finance entry?');
    if (!ok) return;
    this.financeEntries = this.financeEntries.filter(e => e.id !== id);
  }

  get totalIncome(): number {
    return this.financeEntries
      .filter(e => e.type === 'INCOME')
      .reduce((sum, e) => sum + e.amount, 0);
  }

  get totalExpense(): number {
    return this.financeEntries
      .filter(e => e.type === 'EXPENSE')
      .reduce((sum, e) => sum + e.amount, 0);
  }

  get netBalance(): number {
    return this.totalIncome - this.totalExpense;
  }

  // ===================== Calendar helpers =====================

  get calendarTitle(): string {
    const date = new Date(this.calYear, this.calMonth, 1);
    return date.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  }

  prevMonth() {
    this.calMonth--;
    if (this.calMonth < 0) {
      this.calMonth = 11;
      this.calYear--;
    }
  }

  nextMonth() {
    this.calMonth++;
    if (this.calMonth > 11) {
      this.calMonth = 0;
      this.calYear++;
    }
  }

  get calendarDays(): Array<{ dateISO: string; dayNum: number; isCurrentMonth: boolean; count: number }> {
    const firstDay = new Date(this.calYear, this.calMonth, 1);
    const startWeekday = firstDay.getDay(); // 0 Sun .. 6 Sat
    const start = new Date(this.calYear, this.calMonth, 1 - startWeekday);

    const days: Array<{ dateISO: string; dayNum: number; isCurrentMonth: boolean; count: number }> = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);

      const iso = this.toISODate(d);
      const isCurrentMonth = d.getMonth() === this.calMonth;
      const count = this.cases.filter(c => c.nextHearingDate === iso).length;

      days.push({ dateISO: iso, dayNum: d.getDate(), isCurrentMonth, count });
    }
    return days;
  }

  // ===================== Small Utilities =====================

  private emptyCaseModel(): Omit<CaseItem, 'id'> {
    return {
      clientType: '',
      fileNo: '',
      caseNo: '',
      caseTitle: '',
      partyRepresent: '',
      caseType: '',
      courtName: '',
      city: '',
      handledByName: '',
      handledByPhone: '',
      handledByAddress: '',
      handledByEmail: '',
      nextHearingDate: '',
      fixedFor: '',
      status: 'OPEN',
      createdAt: this.todayISO(),
    };
  }

  private nextId(ids: number[]): number {
    return (ids.length ? Math.max(...ids) : 0) + 1;
  }

  private todayISO(): string {
    return this.toISODate(new Date());
  }

  private todayPlusDays(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return this.toISODate(d);
  }

  private toISODate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}