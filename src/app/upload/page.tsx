'use client';

import { useState, useRef } from 'react';
import Sidebar from '@/components/sidebar';
import { Upload, FileText, CheckCircle, XCircle, Loader2, Download } from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.name.endsWith('.csv')) {
            setFile(selectedFile);
            setError('');
            setResult(null);
        } else {
            setError('Please select a valid CSV file');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.name.endsWith('.csv')) {
            setFile(droppedFile);
            setError('');
            setResult(null);
        } else {
            setError('Please drop a valid CSV file');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError('');
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${API_URL}/api/leads/upload-csv`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            setResult(data);
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const downloadTemplate = () => {
        const headers = ['Business Name', 'Phone', 'Email', 'City', 'State', 'Rating', 'Reviews', 'Address', 'Website', 'Industry'];
        const example = ['ABC Roofing Co', '3865551234', 'contact@abcroofing.com', 'Daytona Beach', 'FL', '4.8', '45', '123 Main St', 'https://abcroofing.com', 'roofing'];
        
        const csvContent = [headers.join(','), example.join(',')].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'leads_template.csv';
        a.click();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <main className="ml-64 p-8">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Upload Leads</h1>
                        <p className="text-gray-500 mt-1">Import leads from a CSV file</p>
                    </div>

                    {/* Download Template */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-blue-900">Need a template?</p>
                            <p className="text-sm text-blue-700">Download our CSV template with the correct column headers</p>
                        </div>
                        <button
                            onClick={downloadTemplate}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Download size={18} />
                            Download Template
                        </button>
                    </div>

                    {/* Upload Area */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
                            dragOver 
                                ? 'border-blue-500 bg-blue-50' 
                                : file 
                                    ? 'border-green-500 bg-green-50' 
                                    : 'border-gray-300 bg-white'
                        }`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                            id="csv-upload"
                        />
                        
                        {!file ? (
                            <label htmlFor="csv-upload" className="cursor-pointer">
                                <Upload size={48} className={`mx-auto mb-4 ${dragOver ? 'text-blue-500' : 'text-gray-400'}`} />
                                <p className="text-lg font-medium text-gray-700">
                                    {dragOver ? 'Drop your CSV here' : 'Drag & drop your CSV file here'}
                                </p>
                                <p className="text-gray-500 mt-2">or click to browse</p>
                                <p className="text-xs text-gray-400 mt-4">Maximum file size: 5MB</p>
                            </label>
                        ) : (
                            <div className="flex items-center justify-center gap-3">
                                <FileText size={24} className="text-green-600" />
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">{file.name}</p>
                                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <button
                                    onClick={() => { setFile(null); setResult(null); }}
                                    className="ml-4 text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                            <XCircle size={20} />
                            {error}
                        </div>
                    )}

                    {/* Upload Button */}
                    {file && (
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload size={20} />
                                    Upload Leads
                                </>
                            )}
                        </button>
                    )}

                    {/* Results */}
                    {result && (
                        <div className="mt-6 bg-white border border-gray-200 rounded-2xl overflow-hidden">
                            <div className="p-4 bg-green-50 border-b border-green-200 flex items-center gap-2">
                                <CheckCircle size={24} className="text-green-600" />
                                <span className="font-semibold text-green-800">Upload Complete</span>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                                        <p className="text-2xl font-bold text-gray-900">{result.stats.total}</p>
                                        <p className="text-sm text-gray-500">Total Rows</p>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-xl">
                                        <p className="text-2xl font-bold text-green-600">{result.stats.saved}</p>
                                        <p className="text-sm text-gray-500">Saved</p>
                                    </div>
                                    <div className="text-center p-4 bg-yellow-50 rounded-xl">
                                        <p className="text-2xl font-bold text-yellow-600">{result.stats.duplicates}</p>
                                        <p className="text-sm text-gray-500">Duplicates</p>
                                    </div>
                                    <div className="text-center p-4 bg-red-50 rounded-xl">
                                        <p className="text-2xl font-bold text-red-600">{result.stats.errors}</p>
                                        <p className="text-sm text-gray-500">Errors</p>
                                    </div>
                                </div>

                                {result.leads && result.leads.length > 0 && (
                                    <div>
                                        <p className="font-medium text-gray-700 mb-2">Preview (first 5):</p>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-gray-50">
                                                        <th className="text-left p-2">Business</th>
                                                        <th className="text-left p-2">Phone</th>
                                                        <th className="text-left p-2">City</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {result.leads.slice(0, 5).map((lead: any, i: number) => (
                                                        <tr key={i} className="border-t">
                                                            <td className="p-2">{lead.business_name}</td>
                                                            <td className="p-2">{lead.phone}</td>
                                                            <td className="p-2">{lead.city}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Supported Columns */}
                    <div className="mt-8 bg-gray-100 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Supported CSV Columns</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                            <span className="bg-white px-3 py-1.5 rounded-lg">Business Name *</span>
                            <span className="bg-white px-3 py-1.5 rounded-lg">Phone *</span>
                            <span className="bg-white px-3 py-1.5 rounded-lg">Email</span>
                            <span className="bg-white px-3 py-1.5 rounded-lg">City</span>
                            <span className="bg-white px-3 py-1.5 rounded-lg">State</span>
                            <span className="bg-white px-3 py-1.5 rounded-lg">Rating</span>
                            <span className="bg-white px-3 py-1.5 rounded-lg">Reviews</span>
                            <span className="bg-white px-3 py-1.5 rounded-lg">Address</span>
                            <span className="bg-white px-3 py-1.5 rounded-lg">Website</span>
                            <span className="bg-white px-3 py-1.5 rounded-lg">Industry</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">* Required fields</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
