// NPV Logistics - Pricing Data
let PRICING_DATA = {
  "regions": {
    "vung1": {
      "name": "Vùng 1 - HCM",
      "address": "581 QL1A, Biên Hòa, Đồng Nai",
      "phone": "0905 371 522"
    },
    "vung2": {
      "name": "Vùng 2 - Đà Nẵng",
      "address": "Đường số 9 KCN Hòa Cầm, Đà Nẵng",
      "phone": "0905 371 504"
    }
  },
  "g1": {
    "vung1": {
      "weightTiers": [
        "500-600",
        "600-800",
        "800-1000",
        "1000-3000",
        ">3000"
      ],
      "routes": [
        {
          "zone": 1,
          "province": "Bình Phước",
          "code": "BPC",
          "area": "TX Đồng Xoài",
          "km": 104,
          "day": "D1",
          "time": "1-2 AM",
          "min": 185000,
          "prices": [
            3800,
            3500,
            3200,
            2900,
            2600
          ]
        },
        {
          "zone": 1,
          "province": "Bình Thuận",
          "code": "BTN",
          "area": "TP Phan Thiết",
          "km": 228,
          "day": "D1",
          "time": "5-6 AM",
          "min": 210000,
          "prices": [
            4300,
            3900,
            3600,
            3200,
            2800
          ]
        },
        {
          "zone": 1,
          "province": "Ninh Thuận",
          "code": "NTN",
          "area": "TP Phan Rang-Tháp Chàm",
          "km": 374,
          "day": "D1",
          "time": "8-9AM",
          "min": 250000,
          "prices": [
            5000,
            4500,
            4100,
            3700,
            3300
          ]
        },
        {
          "zone": 2,
          "province": "Khánh Hòa",
          "code": "KHA",
          "area": "TP Nha Trang",
          "km": 479,
          "day": "D1",
          "time": "10-11AM",
          "min": 280000,
          "prices": [
            5600,
            5100,
            4600,
            4100,
            3600
          ]
        },
        {
          "zone": 2,
          "province": "Phú Yên",
          "code": "PYN",
          "area": "TP Tuy Hoà",
          "km": 600,
          "day": "D1",
          "time": "1-2PM",
          "min": 320000,
          "prices": [
            6200,
            5600,
            5100,
            4500,
            3900
          ]
        },
        {
          "zone": 2,
          "province": "Bình Định",
          "code": "BDH",
          "area": "TP Quy Nhơn",
          "km": 707,
          "day": "D1",
          "time": "3-4PM",
          "min": 350000,
          "prices": [
            6500,
            5900,
            5400,
            4800,
            4200
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Ngãi",
          "code": "QNI",
          "area": "TX Quảng Ngãi",
          "km": 875,
          "day": "D2",
          "time": "1-2AM",
          "min": 380000,
          "prices": [
            7100,
            6400,
            5800,
            5200,
            4500
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Nam",
          "code": "QNM",
          "area": "TX Tam Kỳ, Núi Thành",
          "km": 938,
          "day": "D2",
          "time": "3-4AM",
          "min": 400000,
          "prices": [
            7400,
            6700,
            6100,
            5400,
            4700
          ]
        },
        {
          "zone": 2,
          "province": "Đà Nẵng",
          "code": "DNG",
          "area": "TP Đà Nẵng",
          "km": 1000,
          "day": "D2",
          "time": "8-9AM",
          "min": 420000,
          "prices": [
            7700,
            7000,
            6400,
            5700,
            4900
          ]
        },
        {
          "zone": 2,
          "province": "Thừa Thiên Huế",
          "code": "TTH",
          "area": "TP Huế",
          "km": 1105,
          "day": "D2",
          "time": "11-12PM",
          "min": 450000,
          "prices": [
            8200,
            7400,
            6800,
            6000,
            5200
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Trị",
          "code": "QTI",
          "area": "TX Đông Hà",
          "km": 1179,
          "day": "D3",
          "time": "4-5AM",
          "min": 480000,
          "prices": [
            8600,
            7800,
            7100,
            6300,
            5500
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Bình",
          "code": "QBH",
          "area": "TP Đồng Hới",
          "km": 1271,
          "day": "D3",
          "time": "8-9AM",
          "min": 500000,
          "prices": [
            8900,
            8100,
            7400,
            6600,
            5700
          ]
        },
        {
          "zone": 2,
          "province": "Hà Tĩnh",
          "code": "HTH",
          "area": "TX Hà Tĩnh",
          "km": 1419,
          "day": "D3",
          "time": "11-12AM",
          "min": 530000,
          "prices": [
            9300,
            8400,
            7700,
            6800,
            5900
          ]
        },
        {
          "zone": 3,
          "province": "Nghệ An",
          "code": "NAN",
          "area": "TP Vinh",
          "km": 1468,
          "day": "D3",
          "time": "1-2PM",
          "min": 550000,
          "prices": [
            9600,
            8700,
            7900,
            7000,
            6100
          ]
        },
        {
          "zone": 3,
          "province": "Thanh Hóa",
          "code": "THA",
          "area": "TP Thanh Hoá",
          "km": 1606,
          "day": "D3",
          "time": "8-9PM",
          "min": 580000,
          "prices": [
            10000,
            9100,
            8300,
            7300,
            6400
          ]
        },
        {
          "zone": 3,
          "province": "Ninh Bình",
          "code": "NBH",
          "area": "TP Ninh Bình",
          "km": 1666,
          "day": "D4",
          "time": "1-2AM",
          "min": 600000,
          "prices": [
            10300,
            9400,
            8500,
            7500,
            6600
          ]
        },
        {
          "zone": 3,
          "province": "Hà Nam",
          "code": "HNM",
          "area": "Phủ Lý, Đồng Văn",
          "km": 1700,
          "day": "D4",
          "time": "3-4AM",
          "min": 610000,
          "prices": [
            10500,
            9500,
            8700,
            7700,
            6700
          ]
        },
        {
          "zone": 3,
          "province": "Hà Nội",
          "code": "HNI",
          "area": "Nội thành, KCN",
          "km": 1800,
          "day": "D4",
          "time": "8-9AM",
          "min": 650000,
          "prices": [
            10900,
            9900,
            9000,
            8000,
            7000
          ]
        },
        {
          "zone": 4,
          "province": "Đắk Nông",
          "code": "DKN",
          "area": "TX Gia Nghĩa",
          "km": 515,
          "day": "D1",
          "time": "6-7AM",
          "min": 260000,
          "prices": [
            5300,
            4800,
            4300,
            3800,
            3300
          ]
        },
        {
          "zone": 4,
          "province": "Đắk Lắk",
          "code": "DLK",
          "area": "Buôn Mê Thuột",
          "km": 630,
          "day": "D1",
          "time": "10-11AM",
          "min": 300000,
          "prices": [
            5900,
            5400,
            4900,
            4300,
            3700
          ]
        },
        {
          "zone": 4,
          "province": "Gia Lai",
          "code": "GLI",
          "area": "TP Pleiku",
          "km": 790,
          "day": "D1",
          "time": "3-4PM",
          "min": 340000,
          "prices": [
            6400,
            5800,
            5300,
            4700,
            4100
          ]
        },
        {
          "zone": 4,
          "province": "Kon Tum",
          "code": "KTM",
          "area": "TX Kontum",
          "km": 860,
          "day": "D2",
          "time": "7-8PM",
          "min": 360000,
          "prices": [
            6800,
            6200,
            5600,
            5000,
            4300
          ]
        }
      ],
      "notes": {
        "oversizePercent": 15,
        "chemicalPercent": 15
      }
    },
    "vung2": {
      "weightTiers": [
        "500-600",
        "600-800",
        "800-1000",
        "1000-3000",
        ">3000"
      ],
      "routes": [
        {
          "zone": 1,
          "province": "Ninh Thuận",
          "code": "NTN",
          "area": "TP Phan Rang-Tháp Chàm",
          "km": 621,
          "day": "D1",
          "time": "20-21PM",
          "min": 350000,
          "prices": [
            6500,
            5900,
            5400,
            4800,
            4200
          ]
        },
        {
          "zone": 1,
          "province": "Bình Thuận",
          "code": "BTN",
          "area": "TP Phan Thiết",
          "km": 766,
          "day": "D2",
          "time": "1-2AM",
          "min": 380000,
          "prices": [
            7100,
            6400,
            5800,
            5200,
            4500
          ]
        },
        {
          "zone": 1,
          "province": "Đồng Nai",
          "code": "DNI",
          "area": "TP Biên Hoà, KCN",
          "km": 850,
          "day": "D2",
          "time": "7-8AM",
          "min": 400000,
          "prices": [
            7500,
            6800,
            6200,
            5500,
            4800
          ]
        },
        {
          "zone": 1,
          "province": "Bình Dương",
          "code": "BDG",
          "area": "Thủ Dầu Một, KCN",
          "km": 830,
          "day": "D2",
          "time": "8-9AM",
          "min": 395000,
          "prices": [
            7400,
            6700,
            6100,
            5400,
            4700
          ]
        },
        {
          "zone": 1,
          "province": "Hồ Chí Minh",
          "code": "HCM",
          "area": "Các quận nội thành",
          "km": 856,
          "day": "D2",
          "time": "9-10AM",
          "min": 410000,
          "prices": [
            7600,
            6900,
            6300,
            5600,
            4900
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Nam",
          "code": "QNM",
          "area": "TX Tam Kỳ, Núi Thành",
          "km": 69,
          "day": "D1",
          "time": "11-12PM",
          "min": 150000,
          "prices": [
            3200,
            2900,
            2600,
            2300,
            2000
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Ngãi",
          "code": "QNI",
          "area": "TX Quảng Ngãi",
          "km": 135,
          "day": "D1",
          "time": "2-3AM",
          "min": 180000,
          "prices": [
            3600,
            3300,
            3000,
            2700,
            2300
          ]
        },
        {
          "zone": 2,
          "province": "Bình Định",
          "code": "BDH",
          "area": "TP Quy Nhơn",
          "km": 311,
          "day": "D1",
          "time": "8-9AM",
          "min": 230000,
          "prices": [
            4700,
            4300,
            3900,
            3500,
            3000
          ]
        },
        {
          "zone": 2,
          "province": "Phú Yên",
          "code": "PYN",
          "area": "TP Tuy Hoà",
          "km": 406,
          "day": "D1",
          "time": "11-12AM",
          "min": 270000,
          "prices": [
            5300,
            4800,
            4400,
            3900,
            3400
          ]
        },
        {
          "zone": 2,
          "province": "Khánh Hòa",
          "code": "KHA",
          "area": "TP Nha Trang",
          "km": 528,
          "day": "D1",
          "time": "16-17PM",
          "min": 310000,
          "prices": [
            5900,
            5400,
            4900,
            4400,
            3800
          ]
        },
        {
          "zone": 2,
          "province": "Thừa Thiên Huế",
          "code": "TTH",
          "area": "TP Huế",
          "km": 105,
          "day": "D1",
          "time": "11-12PM",
          "min": 170000,
          "prices": [
            3400,
            3100,
            2800,
            2500,
            2200
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Trị",
          "code": "QTI",
          "area": "TX Đông Hà",
          "km": 175,
          "day": "D1",
          "time": "4-5AM",
          "min": 190000,
          "prices": [
            3800,
            3500,
            3200,
            2800,
            2400
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Bình",
          "code": "QBH",
          "area": "TP Đồng Hới",
          "km": 274,
          "day": "D1",
          "time": "8-9AM",
          "min": 220000,
          "prices": [
            4400,
            4000,
            3600,
            3200,
            2800
          ]
        },
        {
          "zone": 2,
          "province": "Hà Tĩnh",
          "code": "HTH",
          "area": "TX Hà Tĩnh",
          "km": 422,
          "day": "D2",
          "time": "11-12AM",
          "min": 280000,
          "prices": [
            5500,
            5000,
            4500,
            4000,
            3500
          ]
        },
        {
          "zone": 3,
          "province": "Nghệ An",
          "code": "NAN",
          "area": "TP Vinh",
          "km": 472,
          "day": "D1",
          "time": "13-14PM",
          "min": 300000,
          "prices": [
            5800,
            5300,
            4800,
            4300,
            3700
          ]
        },
        {
          "zone": 3,
          "province": "Thanh Hóa",
          "code": "THA",
          "area": "TP Thanh Hoá",
          "km": 618,
          "day": "D1",
          "time": "20-21PM",
          "min": 350000,
          "prices": [
            6500,
            5900,
            5400,
            4800,
            4200
          ]
        },
        {
          "zone": 3,
          "province": "Ninh Bình",
          "code": "NBH",
          "area": "TP Ninh Bình",
          "km": 677,
          "day": "D2",
          "time": "1-2AM",
          "min": 370000,
          "prices": [
            6800,
            6200,
            5600,
            5000,
            4400
          ]
        },
        {
          "zone": 3,
          "province": "Hà Nam",
          "code": "HNM",
          "area": "Phủ Lý, Đồng Văn",
          "km": 712,
          "day": "D2",
          "time": "3-4AM",
          "min": 380000,
          "prices": [
            7100,
            6400,
            5800,
            5200,
            4500
          ]
        },
        {
          "zone": 3,
          "province": "Hà Nội",
          "code": "HNI",
          "area": "Nội thành, KCN",
          "km": 772,
          "day": "D2",
          "time": "8-9AM",
          "min": 400000,
          "prices": [
            7500,
            6800,
            6200,
            5500,
            4800
          ]
        },
        {
          "zone": 4,
          "province": "Kon Tum",
          "code": "KTM",
          "area": "TX Kontum",
          "km": 291,
          "day": "D1",
          "time": "6-7AM",
          "min": 220000,
          "prices": [
            4500,
            4100,
            3700,
            3300,
            2900
          ]
        },
        {
          "zone": 4,
          "province": "Gia Lai",
          "code": "GLI",
          "area": "TP Pleiku",
          "km": 366,
          "day": "D1",
          "time": "9-10AM",
          "min": 260000,
          "prices": [
            5100,
            4600,
            4200,
            3700,
            3200
          ]
        },
        {
          "zone": 4,
          "province": "Đắk Lắk",
          "code": "DLK",
          "area": "Buôn Mê Thuột",
          "km": 546,
          "day": "D1",
          "time": "15-16PM",
          "min": 320000,
          "prices": [
            6200,
            5600,
            5100,
            4500,
            3900
          ]
        },
        {
          "zone": 4,
          "province": "Đắk Nông",
          "code": "DKN",
          "area": "TX Gia Nghĩa",
          "km": 610,
          "day": "D1",
          "time": "18-19PM",
          "min": 340000,
          "prices": [
            6400,
            5800,
            5300,
            4700,
            4100
          ]
        },
        {
          "zone": 4,
          "province": "Lâm Đồng",
          "code": "LDG",
          "area": "TP Đà Lạt, TX Bảo Lộc",
          "km": 790,
          "day": "D2",
          "time": "1-2AM",
          "min": 380000,
          "prices": [
            7100,
            6400,
            5800,
            5200,
            4500
          ]
        }
      ],
      "notes": {
        "oversizePercent": 30,
        "chemicalPercent": 20
      }
    }
  },
  "g2": {
    "vung1": {
      "weightTiers": [
        "400-600",
        "600-800",
        "800-1000",
        "1000-2000",
        "2000-5000",
        ">5000"
      ],
      "routes": [
        {
          "zone": 1,
          "province": "Bình Phước",
          "code": "BPC",
          "area": "TX Đồng Xoài",
          "deliveryTime": "1-2 ngày",
          "min": 120000,
          "prices": [
            4000,
            3600,
            3300,
            3000,
            2700,
            2400
          ]
        },
        {
          "zone": 1,
          "province": "Bình Thuận",
          "code": "BTN",
          "area": "TP Phan Thiết",
          "deliveryTime": "1-2 ngày",
          "min": 140000,
          "prices": [
            4500,
            4100,
            3700,
            3300,
            3000,
            2600
          ]
        },
        {
          "zone": 1,
          "province": "Ninh Thuận",
          "code": "NTN",
          "area": "TP Phan Rang-Tháp Chàm",
          "deliveryTime": "1-2 ngày",
          "min": 160000,
          "prices": [
            5000,
            4500,
            4100,
            3700,
            3300,
            2900
          ]
        },
        {
          "zone": 2,
          "province": "Khánh Hòa",
          "code": "KHA",
          "area": "TP Nha Trang",
          "deliveryTime": "1-2 ngày",
          "min": 180000,
          "prices": [
            5400,
            4900,
            4500,
            4000,
            3500,
            3100
          ]
        },
        {
          "zone": 2,
          "province": "Phú Yên",
          "code": "PYN",
          "area": "TP Tuy Hoà",
          "deliveryTime": "1-2 ngày",
          "min": 200000,
          "prices": [
            5900,
            5300,
            4800,
            4300,
            3800,
            3300
          ]
        },
        {
          "zone": 2,
          "province": "Bình Định",
          "code": "BDH",
          "area": "TP Quy Nhơn",
          "deliveryTime": "2-3 ngày",
          "min": 220000,
          "prices": [
            6300,
            5700,
            5200,
            4600,
            4000,
            3500
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Ngãi",
          "code": "QNI",
          "area": "TX Quảng Ngãi, KCN Dung Quất",
          "deliveryTime": "2-3 ngày",
          "min": 240000,
          "prices": [
            6700,
            6100,
            5500,
            4900,
            4300,
            3700
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Nam",
          "code": "QNM",
          "area": "TX Tam Kỳ, Núi Thành",
          "deliveryTime": "2-3 ngày",
          "min": 250000,
          "prices": [
            6900,
            6300,
            5700,
            5100,
            4500,
            3900
          ]
        },
        {
          "zone": 2,
          "province": "Đà Nẵng",
          "code": "DNG",
          "area": "TP Đà Nẵng",
          "deliveryTime": "2-3 ngày",
          "min": 260000,
          "prices": [
            7100,
            6500,
            5900,
            5300,
            4600,
            4000
          ]
        },
        {
          "zone": 2,
          "province": "Thừa Thiên Huế",
          "code": "TTH",
          "area": "TP Huế",
          "deliveryTime": "2-4 ngày",
          "min": 280000,
          "prices": [
            7500,
            6800,
            6200,
            5500,
            4800,
            4200
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Trị",
          "code": "QTI",
          "area": "TX Đông Hà",
          "deliveryTime": "2-4 ngày",
          "min": 300000,
          "prices": [
            7800,
            7100,
            6500,
            5700,
            5000,
            4400
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Bình",
          "code": "QBH",
          "area": "TP Đồng Hới",
          "deliveryTime": "2-4 ngày",
          "min": 310000,
          "prices": [
            8100,
            7400,
            6700,
            5900,
            5200,
            4500
          ]
        },
        {
          "zone": 2,
          "province": "Hà Tĩnh",
          "code": "HTH",
          "area": "TX Hà Tĩnh",
          "deliveryTime": "3-5 ngày",
          "min": 340000,
          "prices": [
            8600,
            7800,
            7100,
            6300,
            5500,
            4800
          ]
        },
        {
          "zone": 3,
          "province": "Nghệ An",
          "code": "NAN",
          "area": "TP Vinh",
          "deliveryTime": "3-5 ngày",
          "min": 360000,
          "prices": [
            8900,
            8100,
            7400,
            6500,
            5700,
            5000
          ]
        },
        {
          "zone": 3,
          "province": "Thanh Hóa",
          "code": "THA",
          "area": "TP Thanh Hoá",
          "deliveryTime": "3-5 ngày",
          "min": 380000,
          "prices": [
            9300,
            8400,
            7700,
            6800,
            5900,
            5200
          ]
        },
        {
          "zone": 3,
          "province": "Ninh Bình",
          "code": "NBH",
          "area": "TP Ninh Bình",
          "deliveryTime": "3-5 ngày",
          "min": 400000,
          "prices": [
            9600,
            8700,
            7900,
            7000,
            6100,
            5400
          ]
        },
        {
          "zone": 3,
          "province": "Hà Nam",
          "code": "HNM",
          "area": "Phủ Lý, Đồng Văn",
          "deliveryTime": "3-5 ngày",
          "min": 410000,
          "prices": [
            9700,
            8800,
            8000,
            7100,
            6200,
            5500
          ]
        },
        {
          "zone": 3,
          "province": "Hà Nội",
          "code": "HNI",
          "area": "Nội thành, KCN",
          "deliveryTime": "3-5 ngày",
          "min": 430000,
          "prices": [
            10000,
            9100,
            8300,
            7300,
            6400,
            5600
          ]
        },
        {
          "zone": 4,
          "province": "Đắk Nông",
          "code": "DKN",
          "area": "TX Gia Nghĩa",
          "deliveryTime": "1-2 ngày",
          "min": 170000,
          "prices": [
            5200,
            4700,
            4300,
            3800,
            3400,
            3000
          ]
        },
        {
          "zone": 4,
          "province": "Đắk Lắk",
          "code": "DLK",
          "area": "Buôn Mê Thuột",
          "deliveryTime": "1-2 ngày",
          "min": 190000,
          "prices": [
            5600,
            5100,
            4600,
            4100,
            3600,
            3200
          ]
        },
        {
          "zone": 4,
          "province": "Gia Lai",
          "code": "GLI",
          "area": "TP Pleiku",
          "deliveryTime": "1-2 ngày",
          "min": 210000,
          "prices": [
            6000,
            5400,
            4900,
            4400,
            3800,
            3400
          ]
        },
        {
          "zone": 4,
          "province": "Kon Tum",
          "code": "KTM",
          "area": "TX Kontum",
          "deliveryTime": "1-2 ngày",
          "min": 230000,
          "prices": [
            6400,
            5800,
            5300,
            4700,
            4100,
            3600
          ]
        }
      ],
      "notes": {
        "oversizePercent": 15,
        "chemicalPercent": 15
      }
    },
    "vung2": {
      "weightTiers": [
        "400-600",
        "600-800",
        "800-1000",
        "1000-2000",
        "2000-5000",
        ">5000"
      ],
      "routes": [
        {
          "zone": 1,
          "province": "Ninh Thuận",
          "code": "NTN",
          "area": "TP Phan Rang-Tháp Chàm",
          "deliveryTime": "2-3 ngày",
          "min": 220000,
          "prices": [
            5000,
            4500,
            4100,
            3700,
            3300,
            2900
          ]
        },
        {
          "zone": 1,
          "province": "Bình Thuận",
          "code": "BTN",
          "area": "TP Phan Thiết",
          "deliveryTime": "2-3 ngày",
          "min": 240000,
          "prices": [
            5300,
            4800,
            4400,
            3900,
            3500,
            3100
          ]
        },
        {
          "zone": 1,
          "province": "Đồng Nai",
          "code": "DNI",
          "area": "TP Biên Hoà, KCN",
          "deliveryTime": "2-3 ngày",
          "min": 260000,
          "prices": [
            5600,
            5100,
            4600,
            4100,
            3700,
            3200
          ]
        },
        {
          "zone": 1,
          "province": "Bình Dương",
          "code": "BDG",
          "area": "Thủ Dầu Một, KCN",
          "deliveryTime": "2-3 ngày",
          "min": 255000,
          "prices": [
            5500,
            5000,
            4500,
            4000,
            3600,
            3200
          ]
        },
        {
          "zone": 1,
          "province": "Hồ Chí Minh",
          "code": "HCM",
          "area": "Các quận nội thành",
          "deliveryTime": "2-3 ngày",
          "min": 270000,
          "prices": [
            5800,
            5300,
            4800,
            4300,
            3800,
            3300
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Nam",
          "code": "QNM",
          "area": "TX Tam Kỳ, Núi Thành",
          "deliveryTime": "1-2 ngày",
          "min": 100000,
          "prices": [
            2900,
            2600,
            2400,
            2100,
            1900,
            1700
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Ngãi",
          "code": "QNI",
          "area": "TX Quảng Ngãi",
          "deliveryTime": "1-2 ngày",
          "min": 120000,
          "prices": [
            3300,
            3000,
            2700,
            2400,
            2100,
            1900
          ]
        },
        {
          "zone": 2,
          "province": "Bình Định",
          "code": "BDH",
          "area": "TP Quy Nhơn",
          "deliveryTime": "1-2 ngày",
          "min": 150000,
          "prices": [
            3800,
            3500,
            3200,
            2800,
            2500,
            2200
          ]
        },
        {
          "zone": 2,
          "province": "Phú Yên",
          "code": "PYN",
          "area": "TP Tuy Hoà",
          "deliveryTime": "1-2 ngày",
          "min": 170000,
          "prices": [
            4200,
            3800,
            3500,
            3100,
            2700,
            2400
          ]
        },
        {
          "zone": 2,
          "province": "Khánh Hòa",
          "code": "KHA",
          "area": "TP Nha Trang",
          "deliveryTime": "1-2 ngày",
          "min": 200000,
          "prices": [
            4700,
            4300,
            3900,
            3500,
            3100,
            2700
          ]
        },
        {
          "zone": 2,
          "province": "Thừa Thiên Huế",
          "code": "TTH",
          "area": "TP Huế",
          "deliveryTime": "1-2 ngày",
          "min": 110000,
          "prices": [
            3100,
            2800,
            2500,
            2200,
            2000,
            1800
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Trị",
          "code": "QTI",
          "area": "TX Đông Hà",
          "deliveryTime": "1-2 ngày",
          "min": 130000,
          "prices": [
            3500,
            3200,
            2900,
            2500,
            2200,
            2000
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Bình",
          "code": "QBH",
          "area": "TP Đồng Hới",
          "deliveryTime": "1-2 ngày",
          "min": 150000,
          "prices": [
            3700,
            3400,
            3100,
            2700,
            2400,
            2100
          ]
        },
        {
          "zone": 2,
          "province": "Hà Tĩnh",
          "code": "HTH",
          "area": "TX Hà Tĩnh",
          "deliveryTime": "1-2 ngày",
          "min": 180000,
          "prices": [
            4400,
            4000,
            3600,
            3200,
            2800,
            2500
          ]
        },
        {
          "zone": 3,
          "province": "Nghệ An",
          "code": "NAN",
          "area": "TP Vinh",
          "deliveryTime": "2-3 ngày",
          "min": 200000,
          "prices": [
            4700,
            4300,
            3900,
            3500,
            3100,
            2700
          ]
        },
        {
          "zone": 3,
          "province": "Thanh Hóa",
          "code": "THA",
          "area": "TP Thanh Hoá",
          "deliveryTime": "2-3 ngày",
          "min": 230000,
          "prices": [
            5300,
            4800,
            4300,
            3800,
            3400,
            3000
          ]
        },
        {
          "zone": 3,
          "province": "Ninh Bình",
          "code": "NBH",
          "area": "TP Ninh Bình",
          "deliveryTime": "2-3 ngày",
          "min": 250000,
          "prices": [
            5500,
            5000,
            4500,
            4000,
            3600,
            3200
          ]
        },
        {
          "zone": 3,
          "province": "Hà Nam",
          "code": "HNM",
          "area": "Phủ Lý, Đồng Văn",
          "deliveryTime": "2-3 ngày",
          "min": 260000,
          "prices": [
            5700,
            5200,
            4700,
            4200,
            3700,
            3300
          ]
        },
        {
          "zone": 3,
          "province": "Hà Nội",
          "code": "HNI",
          "area": "Nội thành, KCN",
          "deliveryTime": "2-3 ngày",
          "min": 280000,
          "prices": [
            6000,
            5400,
            4900,
            4400,
            3900,
            3400
          ]
        },
        {
          "zone": 4,
          "province": "Kon Tum",
          "code": "KTM",
          "area": "TX Kontum",
          "deliveryTime": "2-3 ngày",
          "min": 150000,
          "prices": [
            3800,
            3500,
            3200,
            2800,
            2500,
            2200
          ]
        },
        {
          "zone": 4,
          "province": "Gia Lai",
          "code": "GLI",
          "area": "TP Pleiku",
          "deliveryTime": "2-3 ngày",
          "min": 170000,
          "prices": [
            4200,
            3800,
            3500,
            3100,
            2700,
            2400
          ]
        },
        {
          "zone": 4,
          "province": "Đắk Lắk",
          "code": "DLK",
          "area": "Buôn Mê Thuột",
          "deliveryTime": "2-3 ngày",
          "min": 200000,
          "prices": [
            4700,
            4300,
            3900,
            3500,
            3100,
            2700
          ]
        },
        {
          "zone": 4,
          "province": "Đắk Nông",
          "code": "DKN",
          "area": "TX Gia Nghĩa",
          "deliveryTime": "2-3 ngày",
          "min": 220000,
          "prices": [
            5000,
            4500,
            4100,
            3700,
            3300,
            2900
          ]
        },
        {
          "zone": 4,
          "province": "Lâm Đồng",
          "code": "LDG",
          "area": "TP Đà Lạt, TX Bảo Lộc",
          "deliveryTime": "2-3 ngày",
          "min": 240000,
          "prices": [
            5300,
            4800,
            4400,
            3900,
            3500,
            3100
          ]
        }
      ],
      "notes": {
        "oversizePercent": 30,
        "chemicalPercent": 20
      }
    }
  },
  "g3": {
    "vung1": {
      "weightTiers": [
        "500-1000",
        "1000-2000",
        "2000-3000",
        "3000-5000",
        ">5000"
      ],
      "routes": [
        {
          "zone": 1,
          "province": "Bình Phước",
          "code": "BPC",
          "area": "TX Đồng Xoài",
          "deliveryTime": "1.5-2.5 ngày",
          "min": 100000,
          "prices": [
            3100,
            2800,
            2500,
            2200,
            1900
          ]
        },
        {
          "zone": 1,
          "province": "Bình Thuận",
          "code": "BTN",
          "area": "TP Phan Thiết",
          "deliveryTime": "1.5-2.5 ngày",
          "min": 120000,
          "prices": [
            3500,
            3100,
            2800,
            2500,
            2200
          ]
        },
        {
          "zone": 1,
          "province": "Ninh Thuận",
          "code": "NTN",
          "area": "TP Phan Rang-Tháp Chàm",
          "deliveryTime": "1.5-2.5 ngày",
          "min": 140000,
          "prices": [
            3900,
            3500,
            3200,
            2800,
            2500
          ]
        },
        {
          "zone": 2,
          "province": "Khánh Hòa",
          "code": "KHA",
          "area": "TP Nha Trang",
          "deliveryTime": "1.5-2.5 ngày",
          "min": 160000,
          "prices": [
            4200,
            3800,
            3500,
            3100,
            2700
          ]
        },
        {
          "zone": 2,
          "province": "Phú Yên",
          "code": "PYN",
          "area": "TP Tuy Hoà",
          "deliveryTime": "1.5-2.5 ngày",
          "min": 175000,
          "prices": [
            4500,
            4100,
            3700,
            3300,
            2900
          ]
        },
        {
          "zone": 2,
          "province": "Bình Định",
          "code": "BDH",
          "area": "TP Quy Nhơn",
          "deliveryTime": "3-4 ngày",
          "min": 190000,
          "prices": [
            4900,
            4400,
            4000,
            3500,
            3100
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Ngãi",
          "code": "QNI",
          "area": "TX Quảng Ngãi, KCN Dung Quất",
          "deliveryTime": "3-4 ngày",
          "min": 210000,
          "prices": [
            5200,
            4700,
            4300,
            3800,
            3300
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Nam",
          "code": "QNM",
          "area": "TX Tam Kỳ, Núi Thành",
          "deliveryTime": "3-4 ngày",
          "min": 220000,
          "prices": [
            5400,
            4900,
            4500,
            3900,
            3400
          ]
        },
        {
          "zone": 2,
          "province": "Đà Nẵng",
          "code": "DNG",
          "area": "TP Đà Nẵng",
          "deliveryTime": "3-4 ngày",
          "min": 230000,
          "prices": [
            5600,
            5100,
            4600,
            4100,
            3600
          ]
        },
        {
          "zone": 2,
          "province": "Thừa Thiên Huế",
          "code": "TTH",
          "area": "TP Huế",
          "deliveryTime": "3-5 ngày",
          "min": 250000,
          "prices": [
            6000,
            5400,
            4900,
            4300,
            3800
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Trị",
          "code": "QTI",
          "area": "TX Đông Hà",
          "deliveryTime": "3-5 ngày",
          "min": 270000,
          "prices": [
            6400,
            5800,
            5200,
            4600,
            4000
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Bình",
          "code": "QBH",
          "area": "TP Đồng Hới",
          "deliveryTime": "3-5 ngày",
          "min": 280000,
          "prices": [
            6600,
            6000,
            5400,
            4800,
            4200
          ]
        },
        {
          "zone": 2,
          "province": "Hà Tĩnh",
          "code": "HTH",
          "area": "TX Hà Tĩnh",
          "deliveryTime": "4-6 ngày",
          "min": 300000,
          "prices": [
            6900,
            6300,
            5700,
            5000,
            4400
          ]
        },
        {
          "zone": 3,
          "province": "Nghệ An",
          "code": "NAN",
          "area": "TP Vinh",
          "deliveryTime": "4-6 ngày",
          "min": 320000,
          "prices": [
            7200,
            6500,
            5900,
            5200,
            4600
          ]
        },
        {
          "zone": 3,
          "province": "Thanh Hóa",
          "code": "THA",
          "area": "TP Thanh Hoá",
          "deliveryTime": "4-6 ngày",
          "min": 340000,
          "prices": [
            7500,
            6800,
            6200,
            5500,
            4800
          ]
        },
        {
          "zone": 3,
          "province": "Ninh Bình",
          "code": "NBH",
          "area": "TP Ninh Bình",
          "deliveryTime": "4-6 ngày",
          "min": 350000,
          "prices": [
            7700,
            7000,
            6400,
            5600,
            4900
          ]
        },
        {
          "zone": 3,
          "province": "Hà Nam",
          "code": "HNM",
          "area": "Phủ Lý, Đồng Văn",
          "deliveryTime": "4-6 ngày",
          "min": 360000,
          "prices": [
            7900,
            7200,
            6500,
            5800,
            5100
          ]
        },
        {
          "zone": 3,
          "province": "Hà Nội",
          "code": "HNI",
          "area": "Nội thành, KCN",
          "deliveryTime": "4-6 ngày",
          "min": 380000,
          "prices": [
            8200,
            7400,
            6800,
            6000,
            5200
          ]
        },
        {
          "zone": 4,
          "province": "Đắk Nông",
          "code": "DKN",
          "area": "TX Gia Nghĩa",
          "deliveryTime": "2-3 ngày",
          "min": 140000,
          "prices": [
            3900,
            3500,
            3200,
            2800,
            2500
          ]
        },
        {
          "zone": 4,
          "province": "Đắk Lắk",
          "code": "DLK",
          "area": "Buôn Mê Thuột",
          "deliveryTime": "2-3 ngày",
          "min": 160000,
          "prices": [
            4200,
            3800,
            3500,
            3100,
            2700
          ]
        },
        {
          "zone": 4,
          "province": "Gia Lai",
          "code": "GLI",
          "area": "TP Pleiku",
          "deliveryTime": "2-3 ngày",
          "min": 180000,
          "prices": [
            4600,
            4200,
            3800,
            3400,
            3000
          ]
        },
        {
          "zone": 4,
          "province": "Kon Tum",
          "code": "KTM",
          "area": "TX Kontum",
          "deliveryTime": "2-3 ngày",
          "min": 195000,
          "prices": [
            4900,
            4400,
            4000,
            3500,
            3100
          ]
        }
      ],
      "notes": {
        "oversizePercent": 30,
        "chemicalPercent": 20
      }
    },
    "vung2": {
      "weightTiers": [
        "500-1000",
        "1000-2000",
        "2000-3000",
        ">3000"
      ],
      "routes": [
        {
          "zone": 1,
          "province": "Ninh Thuận",
          "code": "NTN",
          "area": "TP Phan Rang-Tháp Chàm",
          "deliveryTime": "3-4 ngày",
          "min": 190000,
          "prices": [
            3900,
            3500,
            3200,
            2800
          ]
        },
        {
          "zone": 1,
          "province": "Bình Thuận",
          "code": "BTN",
          "area": "TP Phan Thiết",
          "deliveryTime": "3-4 ngày",
          "min": 210000,
          "prices": [
            4200,
            3800,
            3500,
            3100
          ]
        },
        {
          "zone": 1,
          "province": "Đồng Nai",
          "code": "DNI",
          "area": "TP Biên Hoà, KCN",
          "deliveryTime": "3-4 ngày",
          "min": 230000,
          "prices": [
            4600,
            4200,
            3800,
            3400
          ]
        },
        {
          "zone": 1,
          "province": "Bình Dương",
          "code": "BDG",
          "area": "Thủ Dầu Một, KCN",
          "deliveryTime": "3-4 ngày",
          "min": 225000,
          "prices": [
            4500,
            4100,
            3700,
            3300
          ]
        },
        {
          "zone": 1,
          "province": "Hồ Chí Minh",
          "code": "HCM",
          "area": "Các quận nội thành",
          "deliveryTime": "3-4 ngày",
          "min": 240000,
          "prices": [
            4800,
            4300,
            3900,
            3500
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Nam",
          "code": "QNM",
          "area": "TX Tam Kỳ, Núi Thành",
          "deliveryTime": "2-3 ngày",
          "min": 80000,
          "prices": [
            2200,
            2000,
            1800,
            1600
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Ngãi",
          "code": "QNI",
          "area": "TX Quảng Ngãi",
          "deliveryTime": "2-3 ngày",
          "min": 100000,
          "prices": [
            2600,
            2300,
            2100,
            1800
          ]
        },
        {
          "zone": 2,
          "province": "Bình Định",
          "code": "BDH",
          "area": "TP Quy Nhơn",
          "deliveryTime": "2-3 ngày",
          "min": 130000,
          "prices": [
            3200,
            2900,
            2600,
            2300
          ]
        },
        {
          "zone": 2,
          "province": "Phú Yên",
          "code": "PYN",
          "area": "TP Tuy Hoà",
          "deliveryTime": "2-3 ngày",
          "min": 150000,
          "prices": [
            3500,
            3200,
            2900,
            2500
          ]
        },
        {
          "zone": 2,
          "province": "Khánh Hòa",
          "code": "KHA",
          "area": "TP Nha Trang",
          "deliveryTime": "3-4 ngày",
          "min": 170000,
          "prices": [
            3900,
            3500,
            3200,
            2800
          ]
        },
        {
          "zone": 2,
          "province": "Thừa Thiên Huế",
          "code": "TTH",
          "area": "TP Huế",
          "deliveryTime": "2-3 ngày",
          "min": 90000,
          "prices": [
            2400,
            2200,
            2000,
            1700
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Trị",
          "code": "QTI",
          "area": "TX Đông Hà",
          "deliveryTime": "2-3 ngày",
          "min": 110000,
          "prices": [
            2800,
            2500,
            2300,
            2000
          ]
        },
        {
          "zone": 2,
          "province": "Quảng Bình",
          "code": "QBH",
          "area": "TP Đồng Hới",
          "deliveryTime": "2-3 ngày",
          "min": 130000,
          "prices": [
            3100,
            2800,
            2500,
            2200
          ]
        },
        {
          "zone": 2,
          "province": "Hà Tĩnh",
          "code": "HTH",
          "area": "TX Hà Tĩnh",
          "deliveryTime": "3-4 ngày",
          "min": 160000,
          "prices": [
            3700,
            3300,
            3000,
            2600
          ]
        },
        {
          "zone": 3,
          "province": "Nghệ An",
          "code": "NAN",
          "area": "TP Vinh",
          "deliveryTime": "3-4 ngày",
          "min": 180000,
          "prices": [
            4100,
            3700,
            3300,
            2900
          ]
        },
        {
          "zone": 3,
          "province": "Thanh Hóa",
          "code": "THA",
          "area": "TP Thanh Hoá",
          "deliveryTime": "3-4 ngày",
          "min": 200000,
          "prices": [
            4400,
            4000,
            3600,
            3200
          ]
        },
        {
          "zone": 3,
          "province": "Ninh Bình",
          "code": "NBH",
          "area": "TP Ninh Bình",
          "deliveryTime": "3-4 ngày",
          "min": 215000,
          "prices": [
            4600,
            4200,
            3800,
            3400
          ]
        },
        {
          "zone": 3,
          "province": "Hà Nam",
          "code": "HNM",
          "area": "Phủ Lý, Đồng Văn",
          "deliveryTime": "3-4 ngày",
          "min": 225000,
          "prices": [
            4800,
            4300,
            3900,
            3500
          ]
        },
        {
          "zone": 3,
          "province": "Hà Nội",
          "code": "HNI",
          "area": "Nội thành, KCN",
          "deliveryTime": "3-4 ngày",
          "min": 240000,
          "prices": [
            5100,
            4600,
            4200,
            3700
          ]
        },
        {
          "zone": 4,
          "province": "Kon Tum",
          "code": "KTM",
          "area": "TX Kontum",
          "deliveryTime": "3-4 ngày",
          "min": 130000,
          "prices": [
            3200,
            2900,
            2600,
            2300
          ]
        },
        {
          "zone": 4,
          "province": "Gia Lai",
          "code": "GLI",
          "area": "TP Pleiku",
          "deliveryTime": "3-4 ngày",
          "min": 150000,
          "prices": [
            3500,
            3200,
            2900,
            2500
          ]
        },
        {
          "zone": 4,
          "province": "Đắk Lắk",
          "code": "DLK",
          "area": "Buôn Mê Thuột",
          "deliveryTime": "3-4 ngày",
          "min": 170000,
          "prices": [
            3900,
            3500,
            3200,
            2800
          ]
        },
        {
          "zone": 4,
          "province": "Đắk Nông",
          "code": "DKN",
          "area": "TX Gia Nghĩa",
          "deliveryTime": "3-4 ngày",
          "min": 190000,
          "prices": [
            4200,
            3800,
            3400,
            3000
          ]
        }
      ],
      "notes": {
        "oversizePercent": 15,
        "chemicalPercent": 15
      }
    }
  },
  "g4": {
    "vung1": {
      "kmTiers": [
        "<=10",
        "10-100",
        "100-300",
        "300-500",
        "500-1000",
        ">1000"
      ],
      "vehicles": [
        {
          "id": 1,
          "name": "Xe 1 tấn",
          "size": "2.8×1.5×1.6m",
          "loadTime": "60 phút",
          "basePrice": 850000,
          "kmPrices": [
            0,
            12000,
            10000,
            8500,
            7500,
            6500
          ],
          "waitFee": 80000,
          "extraPoint": 150000
        },
        {
          "id": 2,
          "name": "Xe 1.5 tấn",
          "size": "3.3×1.5×1.6m",
          "loadTime": "80 phút",
          "basePrice": 1100000,
          "kmPrices": [
            0,
            14000,
            12000,
            10000,
            8500,
            7500
          ],
          "waitFee": 100000,
          "extraPoint": 180000
        },
        {
          "id": 3,
          "name": "Xe 2 tấn",
          "size": "4.2×1.7×1.8m",
          "loadTime": "100 phút",
          "basePrice": 1400000,
          "kmPrices": [
            0,
            16000,
            13500,
            11500,
            10000,
            8500
          ],
          "waitFee": 120000,
          "extraPoint": 200000
        },
        {
          "id": 4,
          "name": "Xe 3.5 tấn",
          "size": "4.5×1.9×1.9m",
          "loadTime": "120 phút",
          "basePrice": 1800000,
          "kmPrices": [
            0,
            18000,
            15000,
            13000,
            11000,
            9500
          ],
          "waitFee": 150000,
          "extraPoint": 250000
        },
        {
          "id": 5,
          "name": "Xe 5 tấn",
          "size": "5.1×2.2×2.1m",
          "loadTime": "140 phút",
          "basePrice": 2200000,
          "kmPrices": [
            0,
            20000,
            17000,
            14500,
            12500,
            10500
          ],
          "waitFee": 180000,
          "extraPoint": 300000
        },
        {
          "id": 6,
          "name": "Xe 6 tấn",
          "size": "6.5×2.3×2.6m",
          "loadTime": "160 phút",
          "basePrice": 2600000,
          "kmPrices": [
            0,
            22000,
            18500,
            16000,
            13500,
            11500
          ],
          "waitFee": 200000,
          "extraPoint": 350000
        },
        {
          "id": 7,
          "name": "Xe 7 tấn",
          "size": "7.5×2.3×2.6m",
          "loadTime": "180 phút",
          "basePrice": 3000000,
          "kmPrices": [
            0,
            24000,
            20000,
            17000,
            14500,
            12500
          ],
          "waitFee": 220000,
          "extraPoint": 400000
        }
      ],
      "notes": "Chiều về có hàng = 70% cước chiều đi"
    },
    "vung2": {
      "kmTiers": [
        "<=10",
        "10-100",
        "100-300",
        "300-500",
        "500-1000",
        ">1000"
      ],
      "vehicles": [
        {
          "id": 1,
          "name": "Xe 1 tấn",
          "size": "2.8×1.5×1.6m",
          "loadTime": "60 phút",
          "basePrice": 800000,
          "kmPrices": [
            0,
            11000,
            9500,
            8000,
            7000,
            6000
          ],
          "waitFee": 75000,
          "extraPoint": 140000
        },
        {
          "id": 2,
          "name": "Xe 1.5 tấn",
          "size": "3.3×1.5×1.6m",
          "loadTime": "80 phút",
          "basePrice": 1050000,
          "kmPrices": [
            0,
            13000,
            11000,
            9500,
            8000,
            7000
          ],
          "waitFee": 95000,
          "extraPoint": 170000
        },
        {
          "id": 3,
          "name": "Xe 2 tấn",
          "size": "4.2×1.7×1.8m",
          "loadTime": "100 phút",
          "basePrice": 1350000,
          "kmPrices": [
            0,
            15000,
            12500,
            11000,
            9500,
            8000
          ],
          "waitFee": 110000,
          "extraPoint": 190000
        },
        {
          "id": 4,
          "name": "Xe 3.5 tấn",
          "size": "4.5×1.9×1.9m",
          "loadTime": "120 phút",
          "basePrice": 1750000,
          "kmPrices": [
            0,
            17000,
            14500,
            12500,
            10500,
            9000
          ],
          "waitFee": 140000,
          "extraPoint": 240000
        },
        {
          "id": 5,
          "name": "Xe 5 tấn",
          "size": "5.1×2.2×2.1m",
          "loadTime": "140 phút",
          "basePrice": 2100000,
          "kmPrices": [
            0,
            19000,
            16000,
            14000,
            12000,
            10000
          ],
          "waitFee": 170000,
          "extraPoint": 280000
        },
        {
          "id": 6,
          "name": "Xe 6 tấn",
          "size": "6.5×2.3×2.6m",
          "loadTime": "160 phút",
          "basePrice": 2500000,
          "kmPrices": [
            0,
            21000,
            17500,
            15500,
            13000,
            11000
          ],
          "waitFee": 190000,
          "extraPoint": 330000
        },
        {
          "id": 7,
          "name": "Xe 7 tấn",
          "size": "7.5×2.3×2.6m",
          "loadTime": "180 phút",
          "basePrice": 2900000,
          "kmPrices": [
            0,
            23000,
            19000,
            16500,
            14000,
            12000
          ],
          "waitFee": 210000,
          "extraPoint": 380000
        }
      ],
      "notes": "Chiều về có hàng = 70% cước chiều đi"
    }
  },
  "deliveryFee": {
    "areas": [
      {
        "id": 1,
        "name": "TP HCM / Bình Dương / Đồng Nai",
        "code": "HCM",
        "area": "Nội thành",
        "fees": {
          "xe1t": 350000,
          "xe2t": 500000,
          "xe35t": 700000,
          "xe5t": 900000
        }
      },
      {
        "id": 2,
        "name": "Đà Nẵng",
        "code": "DNG",
        "area": "TP Đà Nẵng",
        "fees": {
          "xe1t": 300000,
          "xe2t": 450000,
          "xe35t": 650000,
          "xe5t": 850000
        }
      },
      {
        "id": 3,
        "name": "Hà Nội",
        "code": "HNI",
        "area": "Nội thành",
        "fees": {
          "xe1t": 350000,
          "xe2t": 500000,
          "xe35t": 700000,
          "xe5t": 900000
        }
      },
      {
        "id": 4,
        "name": "Nha Trang / Huế / Bình Định",
        "code": "NTG_HUE_BDH",
        "area": "TP trung tâm",
        "fees": {
          "xe1t": 320000,
          "xe2t": 470000,
          "xe35t": 670000,
          "xe5t": 870000
        }
      },
      {
        "id": 5,
        "name": "Tây Nguyên (ĐắkNông/ĐắkLắk/GiaLai/KonTum)",
        "code": "TAYNGUYEN",
        "area": "TX trung tâm",
        "fees": {
          "xe1t": 350000,
          "xe2t": 500000,
          "xe35t": 700000,
          "xe5t": 900000
        }
      }
    ],
    "notes": "Áp dụng trong vòng 7km từ trung tâm. Đơn hàng >2000kg trên QL1A/QL14 không cấm tải - miễn phí giao nhận."
  },
  "specialFees": {
    "woodenCrate": {
      "tiers": [
        {
          "cbm": "<=0.03",
          "maxKg": 10,
          "fee": 45000
        },
        {
          "cbm": "0.03-0.06",
          "maxKg": 20,
          "fee": 65000
        },
        {
          "cbm": "0.06-0.1",
          "maxKg": 30,
          "fee": 85000
        },
        {
          "cbm": "0.1-0.3",
          "maxKg": 100,
          "fee": 150000
        },
        {
          "cbm": "0.3-0.5",
          "maxKg": 150,
          "fee": 220000
        },
        {
          "cbm": "0.5-0.7",
          "maxKg": 200,
          "fee": 300000
        },
        {
          "cbm": "0.7-0.9",
          "maxKg": 250,
          "fee": 380000
        },
        {
          "cbm": "0.9-1",
          "maxKg": 300,
          "fee": 450000
        }
      ]
    },
    "counting": {
      "baseFee": 30000,
      "baseQty": 10,
      "extraPerItem": 2000
    },
    "cod": {
      "tiers": [
        {
          "range": "<=300000",
          "fee": 25000
        },
        {
          "range": "300001-600000",
          "fee": 35000
        },
        {
          "range": "600001-1000000",
          "fee": 40000
        },
        {
          "range": "1000001-5000000",
          "feePerMillion": 20000
        },
        {
          "range": "5000001-10000000",
          "feePerMillion": 15000
        },
        {
          "range": ">10000000",
          "feePerMillion": 10000
        }
      ]
    },
    "insurance": {
      "rate": 0.0008
    }
  },
  "surcharges": {
    "vat": 0.1,
    "fuel": 0.23,
    "suburbanExtraPercent": 0.3,
    "suburbanExtraTimeHours": "24-48h"
  },
  "effectiveDate": "15/03/2026"
};
