import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import {
  Upload,
  FileText,
  Eye,
  Download,
  MoreVertical,
  Star,
  File, // Using a generic file icon for the preview image placeholder
} from 'lucide-react';
import { ReportPreviewModal } from '../ui/ReportPreviewModal';
import { toast } from 'sooner';

// Helper function to render the correct icon based on file type
const FileIcon = ({ fileType }) => {
  const type = (fileType || '').toLowerCase();
  if (type.includes('pdf')) {
    return <FileText className="w-10 h-10 text-red-500" />; // Red for PDF
  }
  if (type.includes('image')) {
    // You could return an actual <img> tag here if you have a reliable thumbnail URL
    return <File className="w-10 h-10 text-green-500" />; // Generic image placeholder
  }
  return <FileText className="w-10 h-10 text-blue-500" />;
};

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

  // Placeholder for favorite logic (since it was in the new UI structure)
  const [favoriteReports, setFavoriteReports] = useState({});
  const toggleFavorite = (reportId) => {
    setFavoriteReports(prev => ({
      ...prev,
      [reportId]: !prev[reportId]
    }));
  };

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

    // Existing logic to get a signed URL for PDF/raw reports
    if ((report.fileType && report.fileType.toLowerCase() === 'pdf') || (report.publicId && String(report.publicId).includes('pdf'))) {
      try {
        const token = localStorage.getItem('token');
        const accessRes = await fetch(`${API_BASE}/api/reports/${report._id || report.id}/access`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!accessRes.ok) throw new Error('Access denied');
        const accessData = await accessRes.json();
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

  // Direct download handler (using existing report URL)
  const handleDownload = (report) => {
    const url = report.url || report.secure_url;
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.error('Download URL not available.');
    }
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
      // Clear title and fetch new reports
      setUploadTitle('');
      await fetchReports();
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = ''; // Clear file input
    }
  };

  return (
    <section className="flex flex-col max-w-full items-start gap-5 p-5 bg-white rounded-2xl border border-solid border-neutral-200 shadow-md">
      {/* Header Section */}
      <header className="flex w-full items-center justify-between">
        <h1 className="font-semibold text-[#232323] text-2xl tracking-tight leading-9 whitespace-nowrap">
          Documents
        </h1>

        <div className="flex items-center space-x-3">
          <Input
            value={uploadTitle}
            onChange={(e) => setUploadTitle(e.target.value)}
            placeholder="Report name (optional)"
            className="w-auto min-w-[150px] px-3 py-2 rounded-lg border border-neutral-300 bg-white text-sm focus:ring-[#3a99b7] focus:border-[#3a99b7]"
          />
          <input ref={fileInputRef} type="file" accept="application/pdf,image/*" className="hidden" onChange={handleFileChange} />
          <Button onClick={handleUploadReport} className="h-auto bg-[#3a99b7] hover:bg-[#3a99b7]/90 rounded-lg px-4 py-3.5" disabled={uploading}>
            <Upload className="h-4 w-4 mr-2" />
            <span className="font-medium text-white text-sm tracking-normal leading-5 whitespace-nowrap">
              {uploading ? 'Uploading...' : 'Upload Document'}
            </span>
          </Button>
        </div>
      </header>

      <hr className="w-full border-t border-neutral-200" />

      {/* Reports Grid/Empty State */}
      {recentReports.length === 0 ? (
        <Card className="w-full border-dashed border-2 border-neutral-300 shadow-none">
          <CardContent className="p-10 text-center flex flex-col items-center justify-center">
            <div className="bg-neutral-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-8 w-8 text-[#3a99b7]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents yet</h3>
            <p className="text-gray-600 mb-6">Upload your first medical report or document to get started.</p>
            <Button onClick={handleUploadReport} className="bg-[#3a99b7] hover:bg-[#3a99b7]/90" disabled={uploading}>
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
          {recentReports.map((report) => (
            <Card
              key={report._id || report.id || report.publicId}
              className="flex flex-col items-center justify-center p-0 bg-white rounded-2xl border border-solid border-neutral-200 transition-shadow hover:shadow-lg"
            >
              <CardContent className="flex flex-col items-center justify-start p-0 w-full relative">
                {/* Visual Preview Area */}
                <div className="relative w-full h-[180px] bg-neutral-100 rounded-t-2xl flex items-center justify-center overflow-hidden">
                  {/* Placeholder for the image/thumbnail */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileIcon fileType={report.fileType} />
                  </div>
                  
                  {/* Star/Favorite Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 left-2 h-7 w-7 p-1 bg-white/70 hover:bg-white rounded-full z-10"
                    onClick={() => toggleFavorite(report._id || report.id)}
                  >
                    <Star
                      className={`w-4 h-4 transition-colors ${
                        favoriteReports[report._id || report.id]
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-400"
                      }`}
                    />
                  </Button>
                  
                  {/* More Options Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 p-1 bg-white/70 hover:bg-white rounded-full z-10"
                    // Add dropdown menu logic here for more actions if needed
                  >
                    <MoreVertical className="w-4 h-4 text-gray-700" />
                  </Button>
                </div>

                {/* Details and Actions */}
                <div className="flex flex-col w-full items-center justify-center gap-2 p-4">
                  <div className="flex flex-col w-full items-start gap-1">
                    <p className="font-medium text-[#232323] text-base truncate w-full">
                      {report.title || report.name || report.original_filename || 'Medical Report'}
                    </p>
                    <p className="font-normal text-[#7a7d84] text-xs">
                      {report.date ? report.date : (report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'No Date')}
                      <span className="mx-1">•</span>
                      <span className="capitalize">{report.fileType || report.format || 'File'}</span>
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 w-full mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-neutral-300 text-gray-700 hover:bg-neutral-50"
                      onClick={() => openPreview(report)}
                    >
                      <Eye className="h-4 w-4 mr-1.5" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-neutral-300 text-gray-700 hover:bg-neutral-50"
                      onClick={() => handleDownload(report)}
                    >
                      <Download className="h-4 w-4 mr-1.5" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ReportPreviewModal isOpen={previewOpen} onClose={closePreview} url={previewUrl} title={previewTitle} fileType={previewFileType} />
    </section>
  );
};

export { MedicalReports };