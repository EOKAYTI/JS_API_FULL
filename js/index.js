// function nauAn() {
//   console.log("Nấu ăn");
// }

// function giatDo() {
//   setTimeout(() => {
//     console.log("Giặt đồ");
//   }, 3000);
// }

// function ruaChen() {
//   console.log("Rửa chén");
// }

// nauAn();
// giatDo();
// ruaChen();

/* 
--------------------------------------------------------------
--------------------------Promise ()--------------------------
xử lý bất đồng bộ, dùng để thực hiện nắm bắt hàm thực thi xong 
--------------------------------------------------------------

*/
// Khai báo Promise
let promise = new Promise((resolve, reject) => {
  let diemTrungBinh = 1 + 5;
  // diemTrungBinh > 7 ==> tốt || ==> kém
  setTimeout(() => {
    if (diemTrungBinh > 7) {
      resolve("Loại tốt");
    } else {
      reject("Loại kém");
    }
  }, 5000);
});

promise
  // để đi vào then thì hàm ở trên phải trả về resolve
  .then((res) => {
    console.log(res);
    setTimeout(() => {
      console.log("set timeout thứ 2");
    }, 3000);
  })
  .then((res) => {
    console.log(res);
  })
  // còn nếu ở trên đi vào reject thì mới đi và catch
  .catch((err) => {
    console.log(err);
  });

/* 
----------------------------------------------------------
--------------------ASYNC AWAIT---------------------------
-Xử lý bất động bộ kĩ thuật nâng cao hơn promise ngày xưa-
--------Restful API (GET - POST - PUT - DELETE)-----------
-----Link: https://svcy.myclass.vn/swagger/ui/index#/-----
----------------------------=======-----------------------
- async await phải có try catch để bắt lỗi, còn promis thì có promise.then().catch()
- Khi nào dùng Asyns Await khi nào dùng Promise ? đều giúp xử lý bất đồng bộ, nhiều xử lý bất đồng bộ ( từ 2 trở lên) thì dùng Asysn Await, còn 1 thì dùng promise để rút ngắn code
*/
// Sử dụng link ở phần SinhVienAPI để lấy dữ liệu ở phía BE, gồm 4 chức năng chính (Restfull API)
// Lấy danh sách sinh viên bằng API thông qua BE với cơ chế ASYNC AWAIT
async function getDanhSachSinhVien() {
  try {
    // Trong axios(url, method, data)
    let promise = await axios({
      // url (request url để truy cập tới và lấy dữ liệu ở phía BE)
      url: "https://svcy.myclass.vn/api/SinhVienApi/LayDanhSachSinhVien",
      // method
      method: "GET",
    });
    // tác dụng của await là phải thực hiện xong mới thực hiện 2 câu lệnh clg bên dưới
    console.log(promise);
    console.log("Hello");

    //
    promise.data.map((item, index) => {
      let content = item;
    });
  } catch (error) {
    console.log(error);
  }
}

getDanhSachSinhVien();

/* 
----------------------------
--------BÀI TẬP QLSV--------
----------------------------

*/
const http = axios.create({
  baseURL: "https://svcy.myclass.vn/api/SinhVienApi",
  timeout: 30000,
});

// Hiển thị danh sách sinh viên trong hệ thống
// chỉ sử dụng 1 tác vụ bất đồng bộ duy nhất là lấy dssv thì dùng promise, ko cần dùng asyns await

// Lấy danh sách sinh viên, sử dụng axios lấy dữ liệu từ BE
function getDataSinhVien() {
  // let promise = axios({
  //   // url : Request URLs
  //   url: "https://svcy.myclass.vn/api/SinhVienApi/LayDanhSachSinhVien",
  //   // method : Phương thức (GET - POST - PUT - DELETE)
  //   method: "GET",
  // });

  let promise = http.get("/LayDanhSachSinhVien");

  // thành công .then(callback funtion) | thất bại .catch(callback funtion)
  promise
    .then((res) => {
      console.log(res.data);
      renderDataSinhVien(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
}

getDataSinhVien();

// hiển thị
function renderDataSinhVien(arr) {
  let content = "";
  for (let sinhVien of arr) {
    const {
      maSinhVien,
      tenSinhVien,
      email,
      soDienThoai,
      loaiSinhVien,
      diemToan,
      diemLy,
      diemHoa,
      diemRenLuyen,
    } = sinhVien;
    let diemTrungBinh = (diemToan + diemLy + diemHoa) / 3 + diemRenLuyen;
    content += `
     <tr class="">
            <td scope="row">${maSinhVien}</td>
            <td>${tenSinhVien}</td>
            <td>${email}</td>
            <td>${soDienThoai}</td>
            <td>${loaiSinhVien}</td>
            <td>${diemTrungBinh}</td>
            <td>
              <button onclick="xoaSinhVien('${maSinhVien}')" class="btn btn-danger">Xoá</button>
              <button onclick="getInfoSinhVien('${maSinhVien}')" class="btn btn-warning">Sửa</button>
            </td>
          </tr>
    `;
  }
  document.getElementById("tBody").innerHTML = content;
}

// Thêm sinh viên vào hệ thống
function getValueForm() {
  // sinhVien {id : value}
  let arrField = document.querySelectorAll("#QLSV_API input,#QLSV_API select");
  let sinhVien = {};
  for (let field of arrField) {
    // field là DOM tới input và select để lấy dữ liệu id và value, dùng destruring để bóc tách dữ liệu
    const { id, value } = field;
    sinhVien[id] = value;
  }
  console.log(sinhVien);
  return sinhVien;
}

document.querySelector("#QLSV_API").onsubmit = function (event) {
  event.preventDefault();
  let sinhVien = getValueForm();

  // sử dụng api từ backend để thêm dữ liệu vào CSDL
  // nếu loại là body thì có thêm thuộc tính data, còn query thì không
  // let promise = axios({
  //   url: "https://svcy.myclass.vn/api/SinhVienApi/ThemSinhVien",
  //   method: "POST",
  //   data: sinhVien,
  // })

  let promise = http.post("/ThemSinhVien", sinhVien);

  promise
    .then((res) => {
      console.log(res);
      // gọi lại dữ liệu từ backend để cập nhật lên table
      renderThongBao("Thêm sinh viên thành công", "success");
      getDataSinhVien();
    })
    .catch((err) => {
      console.log(err);
      renderThongBao(err.response.data, "danger");
    });
};

// Hàm thông báo thành công | thất bại
function renderThongBao(content, error) {
  // success | danger
  const bgError = error == "success" ? "green" : "red";

  Toastify({
    text: content,
    duration: 3000,
    // destination chuyển hướng người dùng khi bấm thông báo
    // destination: "https://github.com/apvarun/toastify-js",
    // newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: bgError,
    },
    // khi bấm vào thông báo thì thực hiện chức năng gì
    onClick: function () {
      console.log("Tôi đã bấm vào thông báo");
    }, // Callback after click
  }).showToast();
}

function xoaSinhVien(maSV) {
  console.log(maSV);

  // let promise = axios({
  //   url: `https://svcy.myclass.vn/api/SinhVienApi/XoaSinhVien?maSinhVien=${maSV}`,
  //   method: "DELETE",
  // });
  let promise = http.delete(`/XoaSinhVien?maSinhVien=${maSV}`);

  promise
    .then((res) => {
      console.log(res);
      // gọi lại dữ liệu từ backend để cập nhật lên table
      getDataSinhVien();
      renderThongBao(res.data, "success");
    })
    .catch((err) => {
      console.log(err);
      getDataSinhVien();
      renderThongBao("Có lỗi xảy ra, vui lòng thử lại", "danger");
    });
}

// thực hiện tạo một sự kiện click cho button sửa chạy hàm getInfoSinhVien
// thực hiện lấy id của sinh viên cần lấy thông tin
// thực hiện sử dụng api lấy thông tin sinh viên để truy xuất lấy dữ liệu từ hệ thống
// thực hiện đưa dữ liệu vào form và lưu ý disabled input mã sv
function getInfoSinhVien(maSV) {
  console.log(maSV);

  // let promise = axios({
  //   url: `https://svcy.myclass.vn/api/SinhVienApi/LayThongTinSinhVien?maSinhVien=${maSV}`,
  //   method: "GET",
  // });

  let promise = http.get(`/LayThongTinSinhVien?maSinhVien=${maSV}`);

  promise
    .then((res) => {
      console.log(res);
      let sinhVien = res.data;
      let arrField = document.querySelectorAll(
        "#QLSV_API input, #QLSV_API select"
      ); // array
      for (let field of arrField) {
        // flied có id và value
        field.value = sinhVien[field.id];
        if (field.id == "maSinhVien") {
          field.readOnly = true;
        }
      }
    })
    .catch((res) => {
      console.log(err);
      renderThongBao(res.response.data, "danger");
      getDataSinhVien();
    });
}

function updateSinhVien() {
  console.log("hello");
  let sinhVien = getValueForm();

  // let promise = axios({
  //   url: `https://svcy.myclass.vn/api/SinhVienApi/CapNhatThongTinSinhVien?maSinhVien=${sinhVien.maSinhVien}`,
  //   method: "PUT",
  //   data: sinhVien,
  // });

  let promise = http.put(
    `/CapNhatThongTinSinhVien?maSinhVien=${sinhVien.maSinhVien}`,
    sinhVien
  );

  promise
    .then((res) => {
      console.log(res);
      // gọi lại dữ liệu từ backend để cập nhật lên table
      getDataSinhVien();
      renderThongBao(res.data, "success");
    })
    .catch((err) => {
      console.log(err);
      renderThongBao("Có 1 vấn đề gì đó", "danger");
      renderDataSinhVien();
    });
}

document.querySelector(".btn-primary").onclick = updateSinhVien;
