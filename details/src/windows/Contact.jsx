import { WindowControls } from '#components'
import { socials } from '#constants'
import WindowWrapper from '#hoc/WindowWrapper'
import { Mail } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import useWeb3Forms from '@web3forms/react'

const Contact = ({ onMinimize, onClose }) => {
  const email = 'hi@shaarav.xyz'
  const [showModal, setShowModal] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [result, setResult] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // react-hook-form
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm()

  // Web3Forms setup
  const accessKey = '18536a8d-1f17-4f02-97b1-e5cf2b45e4fb'

  const { submit: onSubmit } = useWeb3Forms({
    access_key: accessKey,
    settings: {
      from_name: 'Portfolio – Contact',
      subject: 'New Contact Message from Portfolio',
    },
    onSuccess: (msg) => {
      setIsSuccess(true)
      setResult(msg)
      setSubmitting(false)
      reset()
    },
    onError: (msg) => {
      setIsSuccess(false)
      setResult(msg)
      setSubmitting(false)
    }
  })

  useEffect(() => {
    if (isSuccess && showModal) {
      const t = setTimeout(() => setShowModal(false), 1800)
      return () => clearTimeout(t)
    }
  }, [isSuccess, showModal])
  
  return (
    <>
      <div id='window-header' className='flex items-center justify-between window-drag-handle'>
        <WindowControls target="contact" onMinimize={onMinimize} onClose={onClose} />
        <h2 className='flex-1 text-center'>Contact Me</h2>
        <a
          href={`mailto:${email}`}
          title={`Email: ${email}`}
          className='p-2 hover:bg-gray-200 rounded-md transition-colors'
        >
          <Mail size={17} />
        </a>
      </div>
      <div className='p-5 space-y-5'>
        <img
          src='/images/shaarav.jpeg'
          alt='Shaarav'
          loading='lazy'
          className='w-20 rounded-xl'
        />
        <h3>
          Let's Connect
        </h3>
        <p>
          Open for work, collaboration and chitchat.
        </p>
        <p className='italic text-gray-500'>
          "I'm too young to die..."
        </p>
        <ul>
          {socials.map(({id, bg, link, icon, text}) => (
            <li key={id} style={{backgroundColor: bg}}>
              <a 
                href={link} 
                target='_blank' 
                rel='noopener noreferrer'
                title={text}
              >
                <img
                  src={icon}
                  alt={text}
                  loading='lazy'
                  className='size-5'
                />
                <p>
                  {text}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div
            className='absolute inset-0 bg-black/50 backdrop-blur-[2px]'
            onClick={() => setShowModal(false)}
          />
          <div className='relative z-10 w-[min(92vw,520px)] rounded-xl border border-gray-200 bg-white shadow-2xl'>
            <div className='flex items-center justify-between border-b px-5 py-3'>
              <div className='flex items-center gap-2'>
                <Mail size={18} />
                <h3 className='text-base font-semibold'>Send me a message</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className='rounded-md p-1.5 text-gray-500 hover:bg-gray-100'
                aria-label='Close'
              >
                ✕
              </button>
            </div>

            <form
              className='p-5 space-y-4'
              onSubmit={handleSubmit((data, e) => {
                setSubmitting(true)
                onSubmit({ ...data })
              })}
            >
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-1 sm:col-span-1'>
                  <label className='text-sm text-gray-700'>Name</label>
                  <input
                    type='text'
                    className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400'
                    placeholder='Your name'
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && (
                    <p className='text-xs text-red-600'>{errors.name.message}</p>
                  )}
                </div>
                <div className='space-y-1 sm:col-span-1'>
                  <label className='text-sm text-gray-700'>Email</label>
                  <input
                    type='email'
                    className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400'
                    placeholder='you@example.com'
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /[^@\s]+@[^@\s]+\.[^@\s]+/,
                        message: 'Enter a valid email'
                      }
                    })}
                  />
                  {errors.email && (
                    <p className='text-xs text-red-600'>{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className='space-y-1'>
                <label className='text-sm text-gray-700'>Message</label>
                <textarea
                  rows={5}
                  className='w-full resize-y rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400'
                  placeholder="What's on your mind?"
                  {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Please write at least 10 characters' } })}
                />
                {errors.message && (
                  <p className='text-xs text-red-600'>{errors.message.message}</p>
                )}
              </div>

              {/* honeypot field supported by web3forms */}
              <input type='checkbox' className='hidden' style={{ display: 'none' }} tabIndex={-1} autoComplete='off' {...register('botcheck')} />

              {result && (
                <div className={`rounded-md border px-3 py-2 text-sm ${isSuccess ? 'border-green-300 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-700'}`}>
                  {result}
                </div>
              )}

              <div className='flex items-center justify-between pt-1'>
                <button
                  type='button'
                  onClick={() => setShowModal(false)}
                  className='rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={submitting}
                  className='inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {submitting && (
                    <span className='inline-block size-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent' />
                  )}
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

const ContactWindow = WindowWrapper(Contact, 'contact')

export default ContactWindow;
