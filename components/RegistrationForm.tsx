import React, { useState } from 'react';
import { UserData } from '../types';

interface RegistrationFormProps {
  onSubmit: (data: UserData) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<UserData>({
    storeName: '',
    customerCode: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState<Partial<UserData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<UserData> = {};
    if (!formData.storeName.trim()) newErrors.storeName = 'Vui lòng nhập tên cửa hàng';
    
    // Validate Vietnamese Phone Number
    const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
    const cleanPhone = formData.phoneNumber.replace(/\s/g, '');

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phoneNumber = 'SĐT không hợp lệ (10 số, đầu 03-09)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl border-4 border-white/50 animate-[fadeIn_0.5s_ease-in-out]">
      
      {/* LEFT SIDE: Marketing & Prize Showcase */}
      <div className="lg:w-5/12 bg-gradient-to-br from-[#f79413] to-[#d67d0a] p-8 text-white relative overflow-hidden flex flex-col justify-center items-center text-center">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10" 
             style={{backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2.5px)', backgroundSize: '20px 20px'}}>
        </div>
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-400/30 rounded-full blur-xl"></div>

        <div className="relative z-10">
          <div className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 animate-pulse uppercase tracking-wider shadow-md">
            Chương Trình Đặc Biệt
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-black uppercase leading-tight mb-2 drop-shadow-md">
            Quay Ngay<br/>
            <span className="text-yellow-300 text-4xl lg:text-5xl">Trúng Lớn</span>
          </h2>
          
          <p className="text-white/90 font-medium mb-8 text-sm lg:text-base">
            Hàng ngàn phần quà hấp dẫn đang chờ đón Quý Đại Lý & Khách Hàng.
          </p>

          {/* Prize Showcase Visuals */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 flex flex-col items-center hover:bg-white/20 transition-all cursor-default group">
               <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">🛵</span>
               <span className="text-xs font-bold text-yellow-200">Xe Máy</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 flex flex-col items-center hover:bg-white/20 transition-all cursor-default group">
               <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">📺</span>
               <span className="text-xs font-bold text-yellow-200">Smart TV</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 flex flex-col items-center hover:bg-white/20 transition-all cursor-default group">
               <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">💰</span>
               <span className="text-xs font-bold text-yellow-200">500 Triệu</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 flex flex-col items-center hover:bg-white/20 transition-all cursor-default group">
               <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">🎁</span>
               <span className="text-xs font-bold text-yellow-200">Voucher</span>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="w-full h-1 bg-white/20 rounded-full mb-4"></div>
            <p className="text-xs italic opacity-80">
              *Áp dụng cho khách hàng có hóa đơn từ 500k
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="lg:w-7/12 p-8 lg:p-12 bg-white relative">
        <h3 className="text-2xl font-bold text-gray-800 mb-1 flex items-center">
          <span className="bg-brand text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 shadow-md">1</span>
          Thông Tin Tham Gia
        </h3>
        <p className="text-gray-500 text-sm mb-8 ml-11">Nhập chính xác để nhận giải thưởng</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label htmlFor="storeName" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Tên Cửa Hàng / Đại Lý <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <span className="absolute left-4 top-4 text-gray-400">🏪</span>
                <input
                    type="text"
                    id="storeName"
                    className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl border-2 ${errors.storeName ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-brand focus:bg-white'} focus:outline-none transition-all font-medium text-gray-800 placeholder-gray-400`}
                    placeholder="Ví dụ: Tạp hóa Minh Anh"
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                />
            </div>
            {errors.storeName && <p className="mt-1 text-xs text-red-500 font-semibold pl-1">{errors.storeName}</p>}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Số Điện Thoại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <span className="absolute left-4 top-4 text-gray-400">📞</span>
                <input
                    type="tel"
                    id="phoneNumber"
                    className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl border-2 ${errors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-brand focus:bg-white'} focus:outline-none transition-all font-medium text-gray-800 placeholder-gray-400`}
                    placeholder="0912 xxx xxx"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
            </div>
            {errors.phoneNumber && <p className="mt-1 text-xs text-red-500 font-semibold pl-1">{errors.phoneNumber}</p>}
          </div>

          <div>
            <label htmlFor="customerCode" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Mã Khách Hàng (Tùy chọn)
            </label>
            <div className="relative">
                <span className="absolute left-4 top-4 text-gray-400">🧾</span>
                <input
                    type="text"
                    id="customerCode"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-brand focus:bg-white focus:outline-none transition-all font-medium text-gray-800 placeholder-gray-400"
                    placeholder="Mã trên hóa đơn"
                    value={formData.customerCode}
                    onChange={(e) => setFormData({ ...formData, customerCode: e.target.value })}
                />
            </div>
          </div>

          <div className="pt-4">
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-brand to-brand-dark hover:from-brand-light hover:to-brand text-white font-extrabold py-4 rounded-xl shadow-lg shadow-brand/30 transform transition-all hover:-translate-y-1 active:scale-95 text-lg uppercase flex items-center justify-center gap-2 group"
            >
                Bắt Đầu Quay
                <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};