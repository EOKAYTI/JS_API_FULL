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

// // nauAn();
// // giatDo();
// // ruaChen();

// // Promise ()
// let promise = new Promise((resolve, reject) => {
//   let diemTrungBinh = 1 + 5;
//   // diemTrungBinh > 7 ==> tốt || ==> kém
//   setTimeout(() => {
//     if (diemTrungBinh > 7) {
//       resolve("Loại tốt");
//     } else {
//       reject("Loại kém");
//     }
//   }, 5000);
// });

// promise
//   .then((res) => {
//     console.log(res);
//     setTimeout(() => {
//       console.log("set timeout thứ 2");
//     }, 3000);
//   })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// // Async Await
// // Restful API (GET - POST - PUT - DELETE)
// async function getDanhSachSinhVien() {
//   try {
//     let promise = await axios({
//       // url
//       url: "https://svcy.myclass.vn/api/SinhVienApi/LayDanhSachSinhVie",
//       // method
//       method: "GET",
//     });
//     console.log(promise);
//     console.log("Hello");
//     //
//     promise.data.map((item, index) => {
//       let content = item;
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

// getDanhSachSinhVien();

const http = axios.create({
  baseURL: "https://svcy.myclass.vn/api/SinhVienApi",
  timeout: 30000,
});

// Hiển thị danh sách sinh viên trong hệ thống
function getDataSinhVien() {
  // let promise = axios({
  //   // url : Request URL
  //   url: "https://svcy.myclass.vn/api/SinhVienApi/LayDanhSachSinhVien",
  //   // method : Phương thức (GET-POST-PUT-DELETE)
  //   method: "GET",
  // });

  let promise = http.get("/LayDanhSachSinhVien");

  // thành công .then | thất bại .catch
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
    // field là DOM tới input và select
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

function renderThongBao(content, error) {
  // success | danger
  const bgError = error == "success" ? "green" : "red";

  Toastify({
    text: content,
    duration: 3000,
    // chuyển hướng người dùng khi bấm thông báo
    // destination: "https://github.com/apvarun/toastify-js",
    // newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: bgError,
    },
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

  let promise = get(`/LayThongTinSinhVien?maSinhVien=${maSV}`);

  promise
    .then((res) => {
      console.log(res);
      let sinhVien = res.data;
      let arrField = document.querySelectorAll(
        "#QLSV_API input, #QLSV_API select"
      ); // array
      for (let field of arrField) {
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
