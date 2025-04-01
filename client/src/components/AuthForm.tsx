"use client";

import { AuthState } from "@/app/actions/auth";
import { motion } from "framer-motion";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";

interface AuthFormProps {
  action: (formData: FormData) => void;
  state: AuthState | undefined;
  pending: boolean;
}

export default function AuthForm({ action, state, pending }: AuthFormProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <motion.form
        action={action}
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative group bg-white/10 backdrop-blur-lg p-8 shadow-2xl rounded-2xl border border-white/20 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-br from-blue-500/40 via-transparent to-purple-500/40 pointer-events-none"
        />

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          🔒 Enter Access Code
        </h2>

        {state?.message && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-center mb-4">
            {state.message}
          </motion.p>
        )}

        <div className="mb-4">
          <label className="block text-white font-medium">Access Code</label>
          <motion.input
            whileFocus={{
              scale: 1.05,
              boxShadow: "0px 0px 10px rgba(0, 255, 255, 0.3)",
            }}
            name="code"
            type="text"
            placeholder="Enter code"
            className="w-full p-3 mt-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
          {state?.errors?.code && (
            <p className="text-red-400 mt-2">{state.errors.code[0]}</p>
          )}
        </div>

        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 0px 15px rgba(0, 132, 255, 0.6)",
          }}
          whileTap={{ scale: 0.95 }}
          disabled={pending}
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all duration-300 ease-in-out focus:ring-4 focus:ring-blue-300 shadow-lg shadow-blue-500/30">
          {pending ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="w-5 h-5 border-4 border-white border-t-transparent rounded-full"
            />
          ) : (
            "Submit"
          )}
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white hover:text-blue-400 transition-colors duration-200">
            <BiArrowBack className="text-lg" />
            Back to Home
          </Link>
        </motion.div>
      </motion.form>
    </div>
  );
}
