import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import Spinner from './Spinner';

const Login: React.FC = () => {
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleLogin = async () => {
        setIsSigningIn(true);
        setError(null);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (err) {
            console.error("Google 로그인 중 오류 발생:", err);
            setError("로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
            setIsSigningIn(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl text-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">AnD.PLUS</h1>
                    <h2 className="mt-2 text-xl font-semibold text-gray-700">업무 투입시간 분석</h2>
                    <p className="mt-4 text-gray-500">
                        팀의 생산성을 높이기 위한 첫걸음,
                        <br />
                        Google 계정으로 로그인하여 시작하세요.
                    </p>
                </div>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <button
                    onClick={handleGoogleLogin}
                    disabled={isSigningIn}
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                    {isSigningIn ? (
                        <Spinner />
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
                                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.619-3.317-11.28-7.94l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.686 44 24c0-1.341-.138-2.65-.389-3.917z" />
                            </svg>
                            Google 계정으로 로그인
                        </>
                    )}
                </button>
                <p className="text-xs text-gray-400">
                    데이터는 안전하게 관리됩니다.
                </p>
            </div>
        </div>
    );
};

export default Login;
