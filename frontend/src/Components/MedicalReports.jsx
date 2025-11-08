import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import {
  Upload,
  FileText,
  Eye,
  Download
} from 'lucide-react';
import { ReportPreviewModal } from '../ui/ReportPreviewModal';
import { toast } from 'sooner';

const MedicalReports = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const fileInputRef = React.useRef(null);

  // Reports state
  const [recentReports, setRecentReports] = useState([]);

  // Preview modal state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewFileType, setPreviewFileType] = useState('');

  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : 'http://localhost:5000';

  const fetchReports = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/reports/patient`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecentReports(data.reports || []);
      }
    } catch (error) {
      console.error('Reports fetch error:', error);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const openPreview = async (report) => {
    setPreviewTitle(report.title || report.name || 'Medical Report');
    setPreviewFileType(report.fileType || report.format || '');

    // If report is PDF/raw, request a signed access URL from server
    if ((report.fileType && report.fileType.toLowerCase() === 'pdf') || (report.publicId && String(report.publicId).includes('pdf'))) {
      try {
        const token = localStorage.getItem('token');
        // Ask server for a signed access URL
        const accessRes = await fetch(`${API_BASE}/api/reports/${report._id || report.id}/access`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!accessRes.ok) throw new Error('Access denied');
        const accessData = await accessRes.json();

        // Use the signed URL directly for PDFs
        setPreviewUrl(accessData.url);
      } catch (err) {
        console.error('Access error:', err);
        setPreviewUrl(report.previewUrl || report.url || report.secure_url || report.link);
      }
    } else {
      setPreviewUrl(report.previewUrl || report.url || report.secure_url || report.link);
    }

    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
    setPreviewUrl('');
    setPreviewTitle('');
  };

  const handleUploadReport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const token = localStorage.getItem('token');

      // Upload to server which will forward to Cloudinary
      const form = new FormData();
      form.append('file', file);
      if (uploadTitle) form.append('title', uploadTitle);

      const uploadRes = await fetch(`${API_BASE}/api/reports/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: form,
      });

      let uploadData;
      try {
        uploadData = await uploadRes.json();
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        uploadData = {};
      }
      if (!uploadRes.ok) {
        const errorMessage = uploadData?.message || uploadData?.error || `Upload failed (${uploadRes.status})`;
        throw new Error(errorMessage);
      }

      toast.success('Report uploaded successfully');
      await fetchReports();
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Medical Reports</h2>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Medical Reports</h3>
        <div className="flex items-center space-x-3">
          <input
            value={uploadTitle}
            onChange={(e) => setUploadTitle(e.target.value)}
            placeholder="Report name (optional)"
            className="px-3 py-2 rounded border bg-white dark:bg-gray-700 text-sm w-72"
          />
          <input ref={fileInputRef} type="file" accept="application/pdf,image/*" className="hidden" onChange={handleFileChange} />
          <Button onClick={handleUploadReport} className="bg-blue-600 hover:bg-blue-700" disabled={uploading}>
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Report'}
          </Button>
        </div>
      </div>

      {recentReports.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No reports yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Upload your first medical report to get started.</p>
            <Button onClick={handleUploadReport} className="bg-blue-600 hover:bg-blue-700" disabled={uploading}>
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Report'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-1 gap-6">
          {recentReports.map((report) => (
            <Card key={report._id || report.id || report.publicId} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {report.title || report.name || report.original_filename || 'Medical Report'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {report.fileType || report.type || report.format || ''} • {report.date ? report.date : (report.createdAt ? new Date(report.createdAt).toLocaleDateString() : '')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{report.status}</Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Reviewed by:</span>
                    <span className="text-gray-900 dark:text-white">{report.doctor || (report.neurologistId ? 'Neurologist' : '—')}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openPreview(report)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => window.open(report.url || report.secure_url, '_blank')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ReportPreviewModal isOpen={previewOpen} onClose={closePreview} url={previewUrl} title={previewTitle} fileType={previewFileType} />
    </div>
  );
};

export { MedicalReports };