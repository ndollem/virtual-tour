var APP_DATA = {
  "scenes": [
    {
      "id": "0-kamar-utama",
      "name": "Main Room",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1800,
      "initialViewParameters": {
        "yaw": -1.285415076366542,
        "pitch": 0.1540810415713345,
        "fov": 1.3378744097411812
      },
      "linkHotspots": [
        {
          "yaw": -2.0590027895602656,
          "pitch": 0.25131354387612603,
          "rotation": 5.497787143782138,
          "target": "2-kamar-2"
        },
        {
          "yaw": 2.726640379079287,
          "pitch": 0.22942974196651278,
          "rotation": 0,
          "target": "1-kamar-1"
        }
      ],
      "infoHotspots": [
        {
          "yaw": 0.9690001029617648,
          "pitch": 0.33784873704220963,
          "title": "Vase",
          "text": "A vase is an open container (<a href=\"https://en.wikipedia.org/wiki/Vase\" target=\"_blank\">Wiki</a>). It can be made from a number of materials. Vases are often decorated, and they are often used to hold cut flowers. Vases come in different sizes to support whatever flower it is holding or keeping in place."
        },
        {
          "yaw": -0.9566514177676222,
          "pitch": 0.31773720386483184,
          "title": "table",
          "text": "Text table",
          "type": "expand",
          "elementID": "expand"
        },
        {
          "yaw": 1.8871706517066036,
          "pitch": 0.1959723323788083,
          "title": "Couch",
          "text": "Lorem ipsum sit dolor amet",
          "type": "textInfo",
          "elementID": "textInfo"
        }
      ],
      "embedHotspot": [
        {
          "id": "iframespotutama",
          "yaw": 1.140,
          "pitch": 0.099,
          "radius": 3500,
          "extraTransforms": "rotateY(47deg) skewY(-3.75deg) ", //translateZ(4400px) translateX(-5790px) translateY(950px) rotateX(-1.55deg) rotateY(108deg) rotateZ(1.55deg) skewX(0deg) skewY(0deg) scale(3.8)
          "url": '<iframe id="youtube" width="1250" height="750" src="https://www.youtube.com/embed/AX869YpWs08?rel=0&amp;controls=0&amp;showinfo=0&amp;" frameborder="0" allowfullscreen></iframe>'
        }
      ]
    },
    {
      "id": "1-kamar-1",
      "name": "Room 1",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 1718.5,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": 2.155801884780118,
          "pitch": 0.13042203641012584,
          "rotation": 0,
          "target": "0-kamar-utama"
        }
      ],
      "infoHotspots": [
        {
          "yaw": -0.064079040639959146,
          "pitch": -0.13161514561572659,
          "title": "km 1 pic center",
          "text": "<span style=\"font-size: 16px; background-color: rgba(103, 115, 131, 0.8);\">km 1 pic center</span>"
        },
        {
          "yaw": 0.77892979163147864,
          "pitch": 0.07686978725035317,
          "title": "km 1 pic bottomright",
          "text": "<span style=\"font-size: 16px; background-color: rgba(103, 115, 131, 0.8);\">km 1 pic bottomright</span>",
          "type": "info",
          "elementID": "info"

        }
      ],
      "embedHotspot": [
        {
          "id": "iframespot1",
          "yaw": 1.2555,
          "pitch": 0.021,
          "radius": 3335,
          "extraTransforms": "rotateY(-26.5deg) skewY(0.55deg)",
          "url": '<iframe id="youtube" width="1280" height="750" src="https://www.youtube.com/embed/iS91F009Dao?rel=0&amp;controls=0&amp;showinfo=0&amp;" frameborder="0" allowfullscreen></iframe>'
        }
      ]
    },
    {
      "id": "2-kamar-2",
      "name": "Room 2",
      "levels": [
        {
          "tileSize": 256,
          "size": 256,
          "fallbackOnly": true
        },
        {
          "tileSize": 512,
          "size": 512
        },
        {
          "tileSize": 512,
          "size": 1024
        },
        {
          "tileSize": 512,
          "size": 2048
        }
      ],
      "faceSize": 2000,
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      },
      "linkHotspots": [
        {
          "yaw": -2.4968915016754636,
          "pitch": 0.09053580021895868,
          "rotation": 0,
          "target": "0-kamar-utama"
        }
      ],
      "infoHotspots": [
        {
          "yaw": 0.266103088434493,
          "pitch": -0.1,
          "title": "km2 topleft",
          "text": "tv kamar 2 kiri atas"
        },
        {
          "yaw": -1.7968915016754636,
          "pitch": 0.09053580021895868,
          "title": "km2 bottomright",
          "text": "tv kamar 2 kanan bawah",
          "type": "expand",
          "elementID": "expand"
        }
      ],
      "embedHotspot": [
        {
          "id": "iframespot2",
          "yaw": 2.672,
          "pitch": 0.002,
          "radius": 1635,
          "extraTransforms": "rotateY(-28deg)",
          "url": '<iframe id="youtube" width="1250" height="750" src="https://www.youtube.com/embed/3YqPKLZF_WU?rel=0&amp;controls=0&amp;showinfo=0&amp;" frameborder="0" allowfullscreen></iframe>'
        }
      ]
    }
  ],
  "name": "Virtual room tour",
  "settings": {
    "mouseViewMode": "drag",
    "autorotateEnabled": false,
    "fullscreenButton": true,
    "viewControlButtons": true
  }
};
