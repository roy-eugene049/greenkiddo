import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// Form validation schema
const contactSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().or(z.literal('')),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.1,
      when: "beforeChildren"
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (_data: ContactFormData) => {
    setSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      // In real app, this would call an API endpoint
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate success
      setSubmitStatus('success');
      setSubmitMessage('Thank you for your message! We\'ll get back to you soon.');
      reset();

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 5000);
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Something went wrong. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="flex justify-center items-center min-h-screen bg-black mt-6 m-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="p-10 rounded-lg w-full max-w-5xl flex flex-col lg:flex-row gap-8"
        style={{
          background: 'black',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
        variants={itemVariants}
      >
        
        {/* Signup Form Section */}
        <motion.div className="w-full lg:w-1/2" variants={itemVariants}>
          <motion.h1 
            className="text-3xl font-bold mb-6 text-green-ecco text-center"
            variants={itemVariants}
          >
            Let's Have a Chat <span className="wave-emoji">👋</span>
          </motion.h1>
          <motion.p 
            className="text-center font-bold mb-8 text-gray-300"
            variants={itemVariants}
          >
            Questions about our products/services, orders, or just want to say hello? We're here to help.
          </motion.p>

          {/* Success/Error Messages */}
          {submitStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                submitStatus === 'success'
                  ? 'bg-green-ecco/20 border border-green-ecco text-green-ecco'
                  : 'bg-red-500/20 border border-red-500 text-red-500'
              }`}
            >
              {submitStatus === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{submitMessage}</span>
            </motion.div>
          )}
          
          <motion.form 
            className="space-y-6" 
            onSubmit={handleSubmit(onSubmit)}
            variants={containerVariants}
          >
            {/* Grid for Name, Email, and Phone */}
            <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-4" variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <input
                  type="text"
                  placeholder="First Name *"
                  {...register('firstName')}
                  className={`w-full bg-transparent border-b-2 text-white/70 focus:font-semibold focus:text-white focus:outline-none p-2 transition-colors duration-300 ${
                    errors.firstName ? 'border-red-500' : 'border-white/30 focus:border-green-ecco'
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <input
                  type="text"
                  placeholder="Last Name *"
                  {...register('lastName')}
                  className={`w-full bg-transparent border-b-2 text-white/70 focus:font-semibold focus:text-white focus:outline-none p-2 transition-colors duration-300 ${
                    errors.lastName ? 'border-red-500' : 'border-white/30 focus:border-green-ecco'
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <input
                  type="email"
                  placeholder="Email *"
                  {...register('email')}
                  className={`w-full bg-transparent border-b-2 text-white/70 focus:font-semibold focus:text-white focus:outline-none p-2 transition-colors duration-300 ${
                    errors.email ? 'border-red-500' : 'border-white/30 focus:border-green-ecco'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  {...register('phone')}
                  className="w-full bg-transparent border-b-2 border-white/30 text-white/70 focus:font-semibold focus:border-green-ecco focus:text-white focus:outline-none p-2 transition-colors duration-300"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <input
                type="text"
                placeholder="Subject *"
                {...register('subject')}
                className={`w-full bg-transparent border-b-2 text-white/70 focus:font-semibold focus:text-white focus:outline-none p-2 transition-colors duration-300 ${
                  errors.subject ? 'border-red-500' : 'border-white/30 focus:border-green-ecco'
                }`}
              />
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <textarea
                placeholder="Message *"
                rows={6}
                {...register('message')}
                className={`w-full bg-transparent border-b-2 text-white/70 focus:font-semibold focus:text-white focus:outline-none p-2 resize-none transition-colors duration-300 ${
                  errors.message ? 'border-red-500' : 'border-white/30 focus:border-green-ecco'
                }`}
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
              )}
            </motion.div>

            <motion.button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-ecco text-green-950 py-3 rounded-md font-bold hover:bg-opacity-80 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              variants={itemVariants}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Socials */}
          <motion.div 
            className="flex justify-center space-x-4 mt-8"
            variants={containerVariants}
          >
            <motion.a 
              href="#" 
              className="text-white hover:text-green-ecco transition duration-200" 
              variants={itemVariants} 
              whileHover={{ scale: 1.2 }}
            >
              <i className="fab fa-facebook-f"></i>
            </motion.a>
            <motion.a 
              href="#" 
              className="text-white hover:text-green-ecco transition duration-200" 
              variants={itemVariants} 
              whileHover={{ scale: 1.2 }}
            >
              <i className="fab fa-twitter"></i>
            </motion.a>
            <motion.a 
              href="#" 
              className="text-white hover:text-green-ecco transition duration-200" 
              variants={itemVariants} 
              whileHover={{ scale: 1.2 }}
            >
              <i className="fab fa-instagram"></i>
            </motion.a>
            <motion.a 
              href="#" 
              className="text-white hover:text-green-ecco transition duration-200" 
              variants={itemVariants} 
              whileHover={{ scale: 1.2 }}
            >
              <i className="fab fa-linkedin"></i>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Image Section */}
        <motion.div 
          className="w-full lg:w-1/2 flex items-center justify-center"
          variants={itemVariants}
        >
          <LazyLoadImage
            src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1530&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Contact Illustration" 
            effect="blur"
            className="rounded-lg shadow-lg w-full h-auto"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Contact;
