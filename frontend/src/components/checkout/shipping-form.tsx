import { useState, useEffect } from "react";
import { MapPin, Phone, Mail } from "lucide-react";

interface ShippingFormProps {
  initialData: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    ward: string;
    district: string;
    city: string;
  };
  onSubmit: (data: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    ward: string;
    district: string;
    city: string;
  }) => void;
}

// Interfaces for Open API
interface Ward {
  name: string;
  code: number;
}
interface District {
  name: string;
  code: number;
  wards: Ward[];
}
interface Province {
  name: string;
  code: number;
  districts: District[];
}

export function ShippingForm({ initialData, onSubmit }: ShippingFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<District[]>([]);
  const [availableWards, setAvailableWards] = useState<Ward[]>([]);

  // Update formData when initialData changes (auto-fill from parent API)
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Fetch Provinces Data when component mounts
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://provinces.open-api.vn/api/?depth=3");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Lỗi khi tải API tỉnh thành:", error);
      }
    };
    fetchProvinces();
  }, []);

  // Sync Districts when City changes or data loads
  useEffect(() => {
    if (formData.city && provinces.length > 0) {
      const selectedProvince = provinces.find((p) => p.name === formData.city);
      if (selectedProvince) {
        setAvailableDistricts(selectedProvince.districts);
      } else {
        setAvailableDistricts([]);
      }
    } else {
      setAvailableDistricts([]);
    }
  }, [formData.city, provinces]);

  // Sync Wards when District changes or data loads
  useEffect(() => {
    if (formData.district && availableDistricts.length > 0) {
      const selectedDistrict = availableDistricts.find((d) => d.name === formData.district);
      if (selectedDistrict) {
        setAvailableWards(selectedDistrict.wards);
      } else {
        setAvailableWards([]);
      }
    } else {
      setAvailableWards([]);
    }
  }, [formData.district, availableDistricts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      
      // Cascading resets for dropdowns
      if (name === "city") {
        newState.district = "";
        newState.ward = "";
      } else if (name === "district") {
        newState.ward = "";
      }
      
      return newState;
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validatePhone = (phone: string) => {
    // Regex cho Số điện thoại VN: Bắt đầu bằng 03, 05, 07, 08, 09 và độ dài chính xác 10 số.
    const phoneRegex = /^(03|05|07|08|09)+([0-9]{8})\b$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName?.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.email?.trim()) newErrors.email = "Vui lòng nhập email";
    
    if (!formData.phone?.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "SDT không hợp lệ (Bắt buộc 10 số và bắt đầu bằng 03,05,07,08,09)";
    }

    if (!formData.address?.trim()) newErrors.address = "Vui lòng nhập địa chỉ cụ thể";
    if (!formData.city) newErrors.city = "Vui lòng chọn Tỉnh/Thành phố";
    if (!formData.district) newErrors.district = "Vui lòng chọn Quận/Huyện";
    if (!formData.ward) newErrors.ward = "Vui lòng chọn Phường/Xã";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <MapPin size={24} />
        Thông Tin Giao Hàng
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Họ và Tên *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Nhập họ và tên"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.fullName
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-green-300"
            }`}
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <Mail size={16} />
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@email.com"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-green-300"
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <Phone size={16} />
              Số Điện Thoại *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="0912345678"
              maxLength={10}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.phone
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-green-300"
              }`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Địa Chỉ Chi Tiết *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="VD: 123 Đường Trà, Tòa nhà ABC"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.address
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-green-300"
            }`}
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        {/* City & District */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tỉnh/Thành Phố *
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
                errors.city
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-green-300"
              }`}
              disabled={provinces.length === 0}
            >
              <option value="">{provinces.length === 0 ? "Đang tải DL..." : "Chọn Tỉnh/Thành"}</option>
              {provinces.map((city) => (
                <option key={city.code} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quận/Huyện *
            </label>
            <select
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              disabled={!formData.city || availableDistricts.length === 0}
              className={`w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
                errors.district
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-green-300"
              }`}
            >
              <option value="">Chọn Quận/Huyện</option>
              {availableDistricts.map((district) => (
                <option key={district.code} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
            {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
          </div>
        </div>

        {/* Ward */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phường/Xã *
          </label>
          <select
            name="ward"
            value={formData.ward}
            onChange={handleInputChange}
            disabled={!formData.district || availableWards.length === 0}
            className={`w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 disabled:bg-gray-100 ${
              errors.ward
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-green-300"
            }`}
          >
             <option value="">Chọn Phường/Xã</option>
             {availableWards.map((ward) => (
               <option key={ward.code} value={ward.name}>
                 {ward.name}
               </option>
             ))}
          </select>
          {errors.ward && <p className="text-red-500 text-sm mt-1">{errors.ward}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition mt-6 disabled:opacity-50"
          disabled={provinces.length === 0}
        >
          {provinces.length === 0 ? "Xin đợi kết nối dữ liệu..." : "Tiếp Tục Thanh Toán"}
        </button>
      </form>
    </div>
  );
}
