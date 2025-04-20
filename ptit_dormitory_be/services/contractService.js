import Contract from '../models/Contract.js';
import User from '../models/Users.js';
import StudentRoom from '../models/StudentRoom.js';
import Place from '../models/Place.js';
import ContractType from '../models/contractType.js';
import ApiError from '../utils/apiError.js';
import { v4 as uuidv4 } from 'uuid';
import { createReport } from 'docx-templates';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import moment from 'moment';

// Lấy danh sách hợp đồng
export const getContractsService = async (query) => {
  const { page = 1, limit = 10, status, type, student_id } = query;
  const offset = (page - 1) * limit;

  const whereClause = {};
  if (status) whereClause.status = status;
  if (type) whereClause.type = type;
  if (student_id) whereClause.student_id = student_id;

  const { count, rows } = await Contract.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    attributes: ['id', 'student_id', 'type', 'status', 'apply_date'],
    include: [
      {
        model: User,
        as: 'student',
        attributes: ['id', 'first_name', 'last_name', 'student_code'],
      },
    ],
    order: [['apply_date', 'DESC']],
  });

  return {
    contracts: rows,
    pagination: {
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    },
  };
};

// Lấy chi tiết hợp đồng
export const getContractDetailService = async (contractId, user) => {
  let contract;

  if (user.role_id === '1') {
    contract = await Contract.findByPk(contractId);
  } else if (user.role_id === '4') {
    contract = await Contract.findOne({
      where: { student_id: user.id },
      order: [['apply_date', 'DESC']],
    });
  }

  if (!contract) {
    throw new ApiError(404, 'Không tìm thấy hợp đồng');
  }

  const { id, type, student_id, apply_date, status, file_path, form_data } =
    contract;

  return {
    id,
    type,
    student_id,
    apply_date,
    status,
    file_path,
    student: { ...form_data },
  };
};

// Tạo hợp đồng mới
export const createContractService = async (contractData) => {
  // const contractType = await ContractType.findByPk(type);
  // if (!contractType) {
  //   throw new ApiError(404, 'Loại hợp đồng không tồn tại');
  // }
  let templateName = '';

  switch (contractData.type) {
    case 1:
      templateName = 'contract_template.docx';
      break;
    case 2:
      templateName = 'renew_contract_template.docx';
      break;
    case 3:
      templateName = 'cancel_contract_template.docx';
      break;
    default:
      throw new ApiError(400, 'Loại hợp đồng không hợp lệ');
  }

  const buffer = await generateRegistrationFormFileService(
    contractData,
    templateName,
  );

  //  Tạo đường dẫn lưu file
  const contractId = uuidv4();
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const outputDir = path.join(__dirname, '../upload/contract'); // lưu
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const fileName = `${contractId}.docx`;
  const filePath = path.join(outputDir, fileName);
  const relativePath = `/contracts/${fileName}`;

  //  lưu file vào hệ thống
  fs.writeFileSync(filePath, buffer);

  const newContract = await Contract.create({
    id: contractId,
    student_id: null,
    type: contractData.type,
    apply_date: contractData.apply_date,
    status: 'đã gửi',
    file_path: relativePath,
    form_data: contractData,
  });

  return newContract;
};

// Cập nhật hợp đồng
export const updateContractService = async (id, updateData) => {
  console.log('>>>>', id);
  const contract = await Contract.findByPk(id);
  if (!contract) throw new ApiError(404, 'Không tìm thấy hợp đồng');

  const prevStatus = contract.status;
  const newStatus = updateData.status;
  let updatePayload = { ...updateData };
  // Nếu chuyển trạng thái từ "đã gửi" -> "xác nhận"
  if (prevStatus === 'đã gửi' && newStatus === 'xác nhận') {
    const studentData = contract.form_data;

    const existed = await User.findByPk(contract.student_id);
    if (!existed) {
      const newUserId = uuidv4();
      if (studentData.gender === 'Nam') {
        studentData.gender = 'Male';
      } else if (studentData.gender === 'Nữ') {
        studentData.gender = 'Female';
      } else {
        studentData.gender = 'Other';
      }
      const fullName = studentData.full_name?.trim() || '';
      const nameParts = fullName.split(' ');

      studentData.first_name = nameParts.pop();
      studentData.last_name = nameParts.join(' ');
      await User.create({
        id: newUserId,
        role_id: 4,
        ...studentData,
      });

      updatePayload.student_id = newUserId;
    }
  }

  await contract.update(updatePayload);
  return contract;
};

const helpers = {
  formatDate: (date, format) => {
    if (!date) return '';
    return moment(date).format(format);
  },
  formatCurrency: (amount) => {
    if (!amount) return '0';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  },
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
};

export const generateRegistrationFormFileService = async (
  formData,
  templateName,
) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const templatePath = path.join(__dirname, '../templates', templateName);
    console.log('----', formData);

    const templateBuffer = fs.readFileSync(templatePath);
    const contractNumber = formData.student_code?.toString().trim() + 'CTR';

    formData.contract_number = contractNumber;

    // Tạo file từ template
    const buffer = await createReport({
      template: templateBuffer, //
      data: {
        ...formData,
        helpers,
      },
      cmdDelimiter: ['{{', '}}'],
      processLineBreaks: true,
      noSandbox: true,
    });

    return buffer;
  } catch (error) {
    console.error('Error generating registration form file:', error);
    throw new ApiError(500, 'Lỗi khi tạo file đơn đăng ký');
  }
};

export const generateCancelFormFileService = async (formData) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const templatePath = path.join(
      __dirname,
      '../templates/cancel_contract_template.docx',
    );

    const templateBuffer = fs.readFileSync(templatePath);

    // Tạo file từ template
    const buffer = await createReport({
      template: templateBuffer, //
      data: {
        ...formData,
        helpers,
      },
      cmdDelimiter: ['{{', '}}'],
      processLineBreaks: true,
      noSandbox: true,
    });

    return buffer;
  } catch (error) {
    console.error('Error generating cancel form file:', error);
    throw new ApiError(500, 'Lỗi khi tạo file đơn hủy');
  }
};
