// src/components/SearchUserModal.tsx

import { useState } from "react";
import { X } from "lucide-react";
import { useGetUserSearch } from "@/lib/react-query/main";
import cookieService from "@/utils/cookieService";
import { IUserSearch } from "@/interfaces/main";
import { useI18n } from "@/i18n";

const SearchUserModal = ({ onClose, onSelectUser }: {
  onClose: () => void;
  onSelectUser: (user: IUserSearch) => void;
}) => {
  const token = cookieService.getToken()!;
  const [searchTerm, setSearchTerm] = useState("");
  const { data: users, isLoading } = useGetUserSearch(token, searchTerm);
  const { language } = useI18n();
  const isArabic = language === "ar";

  const translateUserType = (type: string) => {
    if (!isArabic) return type;

    const typeTranslations: Record<string, string> = {
      student: "طالب",
      teacher: "معلم",
      family: "ولي أمر",
      parent: "ولي أمر",
    };

    return typeTranslations[type.toLowerCase()] ?? type;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {isArabic ? "بدء محادثة جديدة" : "Start a new chat"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label={isArabic ? "إغلاق" : "Close"}
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={isArabic ? "ابحث عن شخص..." : "Search for a person..."}
            aria-label={isArabic ? "البحث عن شخص" : "Search for a person"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
          />
        </div>

        {/* Search Results */}
        <div className="mt-4 max-h-60 overflow-y-auto">
          {isLoading ? (
            <p className="text-center text-gray-500">
              {isArabic ? "جاري البحث..." : "Searching..."}
            </p>
          ) : users && users.length > 0 ? (
            users.map((user: IUserSearch) => (
              <div
                key={user.id}
                onClick={() => onSelectUser(user)}
                className="flex items-center gap-4 p-3 hover:bg-gray-100 cursor-pointer rounded-md transition-colors"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={user.details.profile_image || "/images/profile-avatar.webp"}
                    alt={user.details.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">{user.details.name}</span>
                  <span className="text-gray-500 text-xs">{translateUserType(user.type)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              {isArabic ? "لم يتم العثور على مستخدمين." : "No users found."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUserModal;
