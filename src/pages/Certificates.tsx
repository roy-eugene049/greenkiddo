import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Certificate } from '../types/course';
import { GraduationCap, Download, Calendar, Award, CheckCircle2, Loader2 } from 'lucide-react';
import { downloadCertificatePDF } from '../services/certificateService';
import { CourseService } from '../services/courseService';
import { useUserDisplay } from '../hooks/useUserDisplay';

const Certificates = () => {
  const { user } = useUser();
  const { displayName } = useUserDisplay();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const loadCertificates = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Mock certificates - in real app, this would come from backend
        const mockCertificates: Certificate[] = [
          {
            id: 'cert-1',
            userId: user.id,
            courseId: '1',
            courseTitle: 'Introduction to Sustainable Living',
            issuedAt: new Date().toISOString(),
            certificateUrl: '#'
          }
        ];
        setCertificates(mockCertificates);
      } catch (error) {
        console.error('Error loading certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownload = async (certificate: Certificate) => {
    if (!user || downloadingId) return;

    setDownloadingId(certificate.id);
    try {
      // Get course details to fetch instructor name
      const course = await CourseService.getCourseById(certificate.courseId);
      const instructorName = course?.instructor?.name;

      await downloadCertificatePDF(
        certificate,
        displayName,
        instructorName
      );
    } catch (error) {
      console.error('Error generating certificate PDF:', error);
      alert('Failed to generate certificate. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading certificates...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-8 h-8 text-green-ecco" />
            <h1 className="text-4xl font-bold">My Certificates</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Your achievements and course completion certificates
          </p>
        </motion.div>

        {certificates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <GraduationCap className="w-24 h-24 mx-auto mb-6 text-gray-600" />
            <h2 className="text-2xl font-bold mb-2">No certificates yet</h2>
            <p className="text-gray-400 mb-6">
              Complete courses to earn certificates
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate, index) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-green-ecco/50 transition-colors"
              >
                {/* Certificate Preview */}
                <div className="aspect-[4/3] bg-gradient-to-br from-green-ecco/20 to-green-ecco/5 flex flex-col items-center justify-center p-8 border-b border-gray-800">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-green-ecco flex items-center justify-center mb-4 mx-auto">
                      <Award className="w-10 h-10 text-black" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Certificate of Completion</h3>
                    <p className="text-sm text-gray-400">GreenKiddo</p>
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">
                    {certificate.courseTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>Issued {formatDate(certificate.issuedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-green-ecco" />
                    <span className="text-sm text-green-ecco font-semibold">Verified</span>
                  </div>
                  <button
                    onClick={() => handleDownload(certificate)}
                    disabled={downloadingId === certificate.id}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-ecco text-black font-bold rounded-lg hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloadingId === certificate.id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Download PDF
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Certificates;

