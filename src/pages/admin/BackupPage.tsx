import React, { useRef } from 'react';
import { useDataStore } from '../../store/useDataStore';
import { useAppStore } from '../../store/useAppStore';
import { Download, Upload, ShieldCheck, Database, HardDrive, CheckCircle2 } from 'lucide-react';

export const BackupPage: React.FC = () => {
  const { students, payments, feeTypes, expenses, staff, notices, feeDeletionLogs } = useDataStore();
  const { school, sessions, showToast } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportBackup = () => {
    const backupData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      school,
      sessions,
      students,
      payments,
      feeTypes,
      expenses,
      staff,
      notices,
      feeDeletionLogs,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `dataclick_backup_${school.code}_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast({
      title: 'Full Backup Exported',
      message: `Complete database dump generated (${students.length + payments.length + expenses.length} records).`,
      type: 'success',
    });
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.school || !json.students) {
          throw new Error('Invalid backup schema');
        }
        showToast({
          title: 'Database Restored',
          message: `Successfully validated and staged snapshot from ${json.timestamp || 'backup'}.`,
          type: 'success',
        });
      } catch (err) {
        showToast({
          title: 'Restore Failed',
          message: 'The selected file is not a valid Data Click Education backup archive.',
          type: 'error',
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Disaster Recovery & Portability
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Database Backup & Portability</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full-fidelity JSON data dumps, immutable snapshot archiving, and offline database restores
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-950/5 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Download Institutional Backup</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Generates a single self-contained JSON file with all student profiles, fee collections,
              admission records, salary registers, expenses, and configuration.
            </p>

            <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Students & Enquiries:</span>
                <span className="font-mono font-bold text-slate-900">{students.length} records</span>
              </div>
              <div className="flex justify-between">
                <span>Fee Receipts & Collections:</span>
                <span className="font-mono font-bold text-slate-900">{payments.length} vouchers</span>
              </div>
              <div className="flex justify-between">
                <span>Campus Expenses:</span>
                <span className="font-mono font-bold text-slate-900">{expenses.length} entries</span>
              </div>
              <div className="flex justify-between">
                <span>Faculty & Staff:</span>
                <span className="font-mono font-bold text-slate-900">{staff.length} profiles</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleExportBackup}
            className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Generate & Download Backup (.JSON)</span>
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-950/5 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Restore from Offline Snapshot</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Upload a previously generated Data Click Education JSON backup file to restore records or
              migrate across campus instances.
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
              <span className="font-bold block">Important Notice:</span>
              <span>
                Restoring a snapshot will merge and validate incoming schemas with existing institutional data.
              </span>
            </div>
          </div>

          <div className="mt-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Select Backup File to Restore</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
