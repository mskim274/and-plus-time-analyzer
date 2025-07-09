import React from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebase';

interface HeaderProps {
    user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {

    const handleLogout = () => {
        if (window.confirm('로그아웃 하시겠습니까?')) {
            auth.signOut();
        }
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-20">
            <div className="max-w-screen-xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">AnD.PLUS 업무시간 분석</h1>
                    <p className="hidden sm:block mt-1 text-sm text-gray-600">팀의 투입 시간을 효율적으로 관리하고 분석하세요.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        {user.photoURL && (
                            <img
                                src={user.photoURL}
                                alt="프로필 사진"
                                className="h-10 w-10 rounded-full"
                            />
                        )}
                        <span className="hidden sm:inline text-sm font-medium text-gray-700">{user.displayName}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
