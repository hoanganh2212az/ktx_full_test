/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Quản lý người dùng hệ thống
 */

/**
 * @swagger
 * /api/user/fetch:
 *   get:
 *     summary: Lấy danh sách người dùng
 *     tags: [User]
 *     parameters:
 *       - name: search
 *         in: query
 *         description: Tìm kiếm theo tên hoặc email
 *         required: false
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Trang hiện tại
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Số lượng kết quả trên mỗi trang
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: role
 *         in: query
 *         description: Lọc theo role_id
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công, trả về danh sách người dùng
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /api/user/fetch/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo ID
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của người dùng
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công, trả về thông tin người dùng
 *       404:
 *         description: Người dùng không tồn tại
 */

/**
 * @swagger
 * /api/user/create:
 *   post:
 *     summary: Tạo tài khoản người dùng mới
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - first_name
 *               - last_name
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               phone_number:
 *                 type: string
 *                 example: "0912345678"
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-01
 *               first_name:
 *                 type: string
 *                 example: Văn
 *               last_name:
 *                 type: string
 *                 example: Nguyễn
 *               status:
 *                 type: integer
 *                 example: 1
 *               role_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công
 *       400:
 *         description: Email đã tồn tại
 */

/**
 * @swagger
 * /api/user/update/{id}:
 *   put:
 *     summary: Cập nhật thông tin tài khoản người dùng
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của người dùng
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: updated@example.com
 *               password:
 *                 type: string
 *                 example: newpassword
 *               phone_number:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Người dùng không tồn tại
 */

/**
 * @swagger
 * /api/user/delete/{id}:
 *   delete:
 *     summary: Xóa tài khoản người dùng
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của người dùng
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa người dùng thành công
 *       404:
 *         description: Người dùng không tồn tại
 */

/**
 * @swagger
 * /api/user/importForeign:
 *   post:
 *     summary: Import sinh viên quốc tế từ file Excel
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Import thành công
 *       400:
 *         description: Lỗi khi import dữ liệu
 */

/**
 * @swagger
 * /api/user/importVn:
 *   post:
 *     summary: Import sinh viên Việt Nam từ file Excel
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Import thành công
 *       400:
 *         description: Lỗi khi import dữ liệu
 */

/**
 * @swagger
 * tags:
 *   - name: StudentRooms
 *     description: Quản lý thông tin phòng sinh viên
 */

/**
 * @swagger
 * /api/user/importroomstudent:
 *   post:
 *     summary: Nhập dữ liệu phòng sinh viên từ file Excel
 *     tags: [StudentRooms]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File Excel chứa thông tin phòng sinh viên
 *     responses:
 *       200:
 *         description: Kết quả nhập dữ liệu phòng sinh viên
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inserted:
 *                   type: integer
 *                   description: Số lượng sinh viên được thêm mới
 *                 updated:
 *                   type: integer
 *                   description: Số lượng sinh viên được cập nhật
 *                 skipped:
 *                   type: integer
 *                   description: Số lượng sinh viên bị bỏ qua (do lỗi dữ liệu)
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       student_code:
 *                         type: string
 *                         description: Mã sinh viên
 *                       room_number:
 *                         type: string
 *                         description: Mã phòng
 *                       action:
 *                         type: string
 *                         description: Hành động thực hiện (inserted, updated, skipped)
 *                       error:
 *                         type: string
 *                         description: Lý do bỏ qua (nếu có)
 *       400:
 *         description: Lỗi trong quá trình nhập dữ liệu
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */

/**
 * @swagger
 * definitions:
 *   StudentRoomImportResult:
 *     type: object
 *     properties:
 *       student_code:
 *         type: string
 *         description: Mã sinh viên
 *       room_number:
 *         type: string
 *         description: Mã phòng
 *       action:
 *         type: string
 *         description: Hành động (inserted, updated, skipped)
 *       error:
 *         type: string
 *         description: Lý do bỏ qua (nếu có)
 */
