var clsImage;
		var iCropLeft, iCropTop, iCropWidth, iCropHeight;

		// 로컬 이미지 파일을 Canvas 에 로드한다.
		function LoadImage()
		{
			if( typeof window.FileReader !== 'function' )
			{
				alert("FileReader is not supported");
				return;
			}

			var inputFile = document.getElementById('image_file');
			var clsFileReader = new FileReader();
			clsFileReader.onload = function(){
				clsImage = new Image();
				clsImage.onload = function(){
					var canvas = document.getElementById("canvas");
					canvas.width = clsImage.width;
					canvas.height = clsImage.height;

					iCropLeft = 50;
					iCropTop = 50;
					iCropWidth = clsImage.width - 200;
					iCropHeight = clsImage.height - 200;
					iImageWidth = clsImage.width;
					iImageHeight = clsImage.height;

					DrawCropRect();
					AddCropMoveEvent();
				};

				clsImage.src = clsFileReader.result;
			};

			clsFileReader.readAsDataURL(inputFile.files[0]);
		}

		// 로컬 이미지 파일과 Crop 을 위한 사각형 박스를 그려준다.
		function DrawCropRect()
		{
			var canvas = document.getElementById("canvas");
			var ctx = canvas.getContext("2d");

			ctx.drawImage( clsImage, 0, 0 );

			ctx.strokeStyle = "#ff0000";
			ctx.beginPath();
			ctx.rect( iCropLeft, iCropTop, iCropWidth, iCropHeight );
			ctx.stroke();
		}

		// 이미지를 crop 하여서 하단 Canvas 에 그려준다.
		function CropImage()
		{
			var canvas = document.getElementById("canvas");

			img = new Image();
			img.onload = function(){
				var canvas = document.getElementById("canvas_crop");
				canvas.width = iCropWidth;
				canvas.height = iCropHeight;
				var ctx = canvas.getContext("2d");
				ctx.drawImage( img, iCropLeft, iCropTop, iCropWidth, iCropHeight, 0, 0, iCropWidth, iCropHeight );
			};

			img.src = canvas.toDataURL();
		}

		// 마우스 이동에 따른 Crop 사각 박스을 이동하기 위한 이벤트 핸들러를 등록한다.
		function AddCropMoveEvent()
		{
			var canvas = document.getElementById("canvas");
			var bDrag = false;
			var iOldX, iOldY;
			var iCropLeftOld, iCropTopOld;

			canvas.onmousedown = function(e){
				bDrag = true;
				iOldX = e.offsetX;
				iOldY = e.offsetY;
                iNewX = e.offsetX;
                iNewY = e.offsetY;
				iCropLeftOld = iCropLeft;
				iCropTopOld = iCropTop;
			};

			canvas.onmousemove = function(e){
				if( bDrag == false ) return;

				var iX = e.offsetX;
				var iY = e.offsetY;

				iCropLeft = iOldX;
                iCropWidth = iX - iOldX;
                iNewX = iX;
				if( iCropLeft < 0 )
				{
					iCropLeft = 0;
				}
				else if( iCropLeft + iCropWidth > clsImage.width )
				{
					iCropLeft = clsImage.width - iCropWidth;
				}

				iCropTop = iOldY;
                iCropHeight = iY - iOldY;
                iNewY = iY;
				if( iCropTop < 0 )
				{
					iCropTop = 0;
				}
				else if( iCropTop + iCropHeight > clsImage.height )
				{
					iCropTop = clsImage.height - iCropHeight;
				}

				DrawCropRect();
			};

			canvas.onmouseup = function(e){
				bDrag = false;
			};
		}