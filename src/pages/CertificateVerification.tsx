import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Search, Shield, Calendar, User, BookOpen } from 'lucide-react';
import { verifyCertificate } from '../services/certificateVerificationService';
import { CertificateMetadata } from '../types/certificate';
import { motion } from 'framer-motion';

const CertificateVerification = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [verificationCode, setVerificationCode] = useState(searchParams.get('code') || '');
  const [result, setResult] = useState<{
    isValid: boolean;
    certificate?: any;
    metadata?: CertificateMetadata;
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!verificationCode.trim()) return;

    setLoading(true);
    try {
      const verificationResult = await verifyCertificate(verificationCode.trim());
      setResult(verificationResult);
      if (verificationResult.isValid) {
        setSearchParams({ code: verificationCode.trim() });
      }
    } catch (error) {
      setResult({
        isValid: false,
        error: 'An error occurred during verification',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-green-ecco" />
            <h1 className="text-4xl font-bold">Certificate Verification</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Verify the authenticity of a GreenKiddo certificate
          </p>
        </div>

        {/* Verification Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                placeholder="Enter verification code (e.g., ABC12345)"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco uppercase"
                maxLength={8}
              />
            </div>
            <button
              onClick={handleVerify}
              disabled={loading || !verificationCode.trim()}
              className="bg-green-ecco text-black font-bold py-3 px-8 rounded-lg hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Verify
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gray-900 border rounded-lg p-8 ${
              result.isValid
                ? 'border-green-ecco bg-green-ecco/5'
                : 'border-red-500 bg-red-500/5'
            }`}
          >
            {result.isValid ? (
              <div className="text-center">
                <CheckCircle2 className="w-16 h-16 text-green-ecco mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-green-ecco">Certificate Verified</h2>
                <p className="text-gray-400 mb-6">This certificate is authentic and valid</p>

                {result.metadata && (
                  <div className="bg-gray-800 rounded-lg p-6 text-left max-w-md mx-auto space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-green-ecco" />
                      <div>
                        <div className="text-sm text-gray-400">Recipient</div>
                        <div className="font-semibold">{result.metadata.userName}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-green-ecco" />
                      <div>
                        <div className="text-sm text-gray-400">Course</div>
                        <div className="font-semibold">{result.metadata.courseTitle}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-green-ecco" />
                      <div>
                        <div className="text-sm text-gray-400">Issued On</div>
                        <div className="font-semibold">
                          {new Date(result.metadata.issuedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                    {result.metadata.verificationCode && (
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-ecco" />
                        <div>
                          <div className="text-sm text-gray-400">Verification Code</div>
                          <div className="font-mono font-semibold">{result.metadata.verificationCode}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-red-500">Verification Failed</h2>
                <p className="text-gray-400">{result.error || 'This certificate could not be verified'}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">How to Verify</h3>
          <ul className="space-y-2 text-gray-400">
            <li>• Enter the 8-character verification code found on the certificate</li>
            <li>• The code is typically located at the bottom of the certificate</li>
            <li>• You can also scan the QR code on the certificate</li>
            <li>• Verified certificates show the recipient name, course, and issue date</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CertificateVerification;

