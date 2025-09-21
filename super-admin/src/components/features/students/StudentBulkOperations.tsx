// @ts-nocheck
/**
 * Student Bulk Operations Component
 * Import/Export functionality with validation and progress tracking
 */

import React, { useState, useRef, useCallback } from 'react';
import { Upload, Download, FileText, CheckCircle, XCircle, X } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { useStudentBulkOperations } from '../../../hooks/useStudents';
import type { StudentFormData, StudentSearchFilters, StudentImportResult } from '../../../types/student.types';
// import { STUDENT_UI_TEXT, STUDENT_ERROR_MESSAGES } from '../../../constants/student.constants';

// ============================================================================
// COMPONENT INTERFACES
// ============================================================================

export interface StudentBulkOperationsProps {
  onImportComplete: (results: StudentImportResult) => void;
  onExportComplete: (file: Blob) => void;
  currentFilters?: StudentSearchFilters;
}

interface ImportState {
  file: File | null;
  preview: StudentFormData[];
  errors: string[];
  isValid: boolean;
}

interface ExportState {
  format: 'csv' | 'xlsx';
  includeEnrollments: boolean;
  includeProgress: boolean;
  selectedColumns: string[];
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const validateCSVRow = (row: Record<string, string>, index: number): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Required fields validation
  if (!row.name || row.name.trim() === '') {
    errors.push(`Row ${index + 1}: Name is required`);
  }
  
  if (!row.parentEmail || row.parentEmail.trim() === '') {
    errors.push(`Row ${index + 1}: Parent email is required`);
  }
  
  if (!row.dateOfBirth || row.dateOfBirth.trim() === '') {
    errors.push(`Row ${index + 1}: Date of birth is required`);
  }
  
  if (!row.school || row.school.trim() === '') {
    errors.push(`Row ${index + 1}: School is required`);
  }
  
  if (!row.grade || row.grade.trim() === '') {
    errors.push(`Row ${index + 1}: Grade is required`);
  }
  
  // Email validation
  if (row.parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.parentEmail)) {
    errors.push(`Row ${index + 1}: Invalid email format`);
  }
  
  // Date validation
  if (row.dateOfBirth) {
    const date = new Date(row.dateOfBirth);
    if (isNaN(date.getTime())) {
      errors.push(`Row ${index + 1}: Invalid date format`);
    } else {
      const today = new Date();
      if (date > today) {
        errors.push(`Row ${index + 1}: Date of birth cannot be in the future`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const parseCSV = (csvText: string): StudentFormData[] => {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows: StudentFormData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    // Map CSV columns to our form data structure
    const studentData: StudentFormData = {
      name: row.name || row.Name || '',
      dateOfBirth: row.dateOfBirth || row['Date of Birth'] || row.date_of_birth || '',
      school: row.school || row.School || '',
      grade: row.grade || row.Grade || '',
      parentEmail: row.parentEmail || row['Parent Email'] || row.parent_email || '',
      parentPhone: row.parentPhone || row['Parent Phone'] || row.parent_phone || '',
      emergencyContactName: row.emergencyContactName || row['Emergency Contact'] || row.emergency_contact_name || '',
      emergencyContactPhone: row.emergencyContactPhone || row['Emergency Phone'] || row.emergency_contact_phone || '',
      emergencyContactRelation: row.emergencyContactRelation || row['Emergency Relation'] || row.emergency_contact_relation || '',
      skillLevel: row.skillLevel || row['Skill Level'] || row.skill_level || '',
      status: row.status || row.Status || 'active',
      specialRequirements: row.specialRequirements || row['Special Requirements'] || row.special_requirements || '',
      progressComments: row.progressComments || row['Progress Comments'] || row.progress_comments || '',
      medicalNotes: row.medicalNotes || row['Medical Notes'] || row.medical_notes || ''
    };
    
    rows.push(studentData);
  }
  
  return rows;
};

// ============================================================================
// STUDENT BULK OPERATIONS COMPONENT
// ============================================================================

export function StudentBulkOperations({
  onImportComplete,
  onExportComplete,
  currentFilters = {}
}: StudentBulkOperationsProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [importState, setImportState] = useState<ImportState>({
    file: null,
    preview: [],
    errors: [],
    isValid: false
  });
  const [exportState, setExportState] = useState<ExportState>({
    format: 'csv',
    includeEnrollments: true,
    includeProgress: true,
    selectedColumns: ['name', 'email', 'school', 'grade', 'status', 'skillLevel']
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    importLoading,
    exportLoading,
    importResult,
    importStudents,
    exportStudents,
    clearImportResult
  } = useStudentBulkOperations();

  // File upload handlers
  const handleFileSelect = useCallback((file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setImportState(prev => ({
        ...prev,
        file: null,
        preview: [],
        errors: ['Please select a valid CSV file'],
        isValid: false
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const parsedData = parseCSV(csvText);
        
        // Validate each row
        const allErrors: string[] = [];
        let allValid = true;
        
        parsedData.forEach((row, index) => {
          const validation = validateCSVRow(row, index);
          if (!validation.isValid) {
            allValid = false;
            allErrors.push(...validation.errors);
          }
        });
        
        setImportState({
          file,
          preview: parsedData,
          errors: allErrors,
          isValid: allValid
        });
      } catch (error) {
        setImportState(prev => ({
          ...prev,
          file: null,
          preview: [],
          errors: ['Error parsing CSV file. Please check the format.'],
          isValid: false
        }));
      }
    };
    
    reader.readAsText(file);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  // Import handlers
  const handleImport = async () => {
    if (!importState.file || !importState.isValid) return;
    
    try {
      const result = await importStudents(importState.preview);
      if (result.success) {
        onImportComplete(importResult!);
      }
    } catch (error) {
      console.error('Import error:', error);
    }
  };

  const handleClearImport = () => {
    setImportState({
      file: null,
      preview: [],
      errors: [],
      isValid: false
    });
    clearImportResult();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Export handlers
  const handleExport = async () => {
    try {
      const result = await exportStudents(currentFilters);
      if (result.success && result.data) {
        const blob = new Blob([result.data], { type: 'text/csv' });
        onExportComplete(blob);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'import'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('import')}
        >
          Import Students
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === 'export'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('export')}
        >
          Export Students
        </button>
      </div>

      {/* Import Tab */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          {/* File Upload */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upload CSV File</h3>
            
            {!importState.file ? (
              <div
                ref={dragRef}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop your CSV file here, or click to browse
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supported format: CSV files only
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                >
                  Choose File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium">{importState.file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(importState.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearImport}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Validation Results */}
                {importState.errors.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="h-4 w-4" />
                      <span className="font-medium">Validation Errors</span>
                    </div>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {importState.errors.map((error, index) => (
                        <p key={index} className="text-sm text-red-600">
                          {error}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {importState.isValid && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">
                      {importState.preview.length} students ready to import
                    </span>
                  </div>
                )}

                {/* Preview */}
                {importState.preview.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Preview (first 5 rows)</h4>
                    <div className="max-h-48 overflow-y-auto border rounded-lg">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left">Name</th>
                            <th className="px-3 py-2 text-left">Email</th>
                            <th className="px-3 py-2 text-left">School</th>
                            <th className="px-3 py-2 text-left">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {importState.preview.slice(0, 5).map((student, index) => (
                            <tr key={index} className="border-t">
                              <td className="px-3 py-2">{student.name}</td>
                              <td className="px-3 py-2">{student.parentEmail}</td>
                              <td className="px-3 py-2">{student.school}</td>
                              <td className="px-3 py-2">{student.grade}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Import Actions */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleClearImport}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleImport}
                    disabled={!importState.isValid || importLoading}
                  >
                    {importLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Import {importState.preview.length} Students
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Import Results */}
          {importResult && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Import Results</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {importResult.totalProcessed}
                  </div>
                  <div className="text-sm text-blue-600">Total Processed</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {importResult.successful}
                  </div>
                  <div className="text-sm text-green-600">Successful</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {importResult.failed}
                  </div>
                  <div className="text-sm text-red-600">Failed</div>
                </div>
              </div>
              
              {importResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">Error Details</h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                      {importResult.errors.map((err, idx) => (
                        <p key={idx} className="text-sm text-red-600">
                          Row {err.row}: {err.message}
                        </p>
                      ))}
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      )}

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Export Options</h3>
            
            <div className="space-y-4">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="csv"
                      checked={exportState.format === 'csv'}
                      onChange={(e) => setExportState(prev => ({ ...prev, format: e.target.value as 'csv' | 'xlsx' }))}
                      className="mr-2"
                    />
                    CSV
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="xlsx"
                      checked={exportState.format === 'xlsx'}
                      onChange={(e) => setExportState(prev => ({ ...prev, format: e.target.value as 'csv' | 'xlsx' }))}
                      className="mr-2"
                    />
                    Excel
                  </label>
                </div>
              </div>

              {/* Include Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Include Additional Data
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportState.includeEnrollments}
                      onChange={(e) => setExportState(prev => ({ ...prev, includeEnrollments: e.target.checked }))}
                      className="mr-2"
                    />
                    Enrollment History
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportState.includeProgress}
                      onChange={(e) => setExportState(prev => ({ ...prev, includeProgress: e.target.checked }))}
                      className="mr-2"
                    />
                    Progress Comments
                  </label>
                </div>
              </div>

              {/* Current Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applied Filters
                </label>
                <div className="flex flex-wrap gap-2">
                  {/* Filters display intentionally removed to simplify and avoid missing Badge dependency */}
                  {/* {Object.entries(currentFilters).map(([key, value]) => {
                    if (!value) return null;
                    return (
                      <span key={key} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-gray-300 text-gray-700">
                        {key}: {Array.isArray(value) ? (value as string[]).join(', ') : String(value)}
                      </span>
                    );
                  })}
                  {Object.keys(currentFilters).length === 0 && (
                    <span className="text-sm text-gray-500">No filters applied</span>
                  )} */}
                </div>
              </div>

              {/* Export Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleExport}
                  disabled={exportLoading}
                >
                  {exportLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export Students
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
