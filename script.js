document.addEventListener('DOMContentLoaded', () => {
    const colorPicker = document.getElementById('colorPicker');
    const fileUploader = document.getElementById('fileUploader');
    const tshirtPreview = document.getElementById('tshirtPreview');
    const tshirtColorOverlay = document.getElementById('tshirtColorOverlay');
    const designOverlay = document.getElementById('designOverlay');
    const downloadBtn = document.getElementById('downloadBtn');

    let designUrl = '';

    // Update T-shirt color
    colorPicker.addEventListener('input', () => {
        tshirtColorOverlay.style.backgroundColor = colorPicker.value;
    });

    // Handle design upload
    fileUploader.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                designUrl = e.target.result;
                designOverlay.style.backgroundImage = `url(${designUrl})`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Download the customized design
    downloadBtn.addEventListener('click', () => {
        if (designUrl) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const tshirtImg = new Image();
            const designImg = new Image();

            // Draw T-shirt image
            tshirtImg.onload = () => {
                // Set canvas size to match T-shirt image size
                canvas.width = tshirtImg.width;
                canvas.height = tshirtImg.height;

                // Draw T-shirt image
                ctx.drawImage(tshirtImg, 0, 0, canvas.width, canvas.height);

                // Apply color overlay using `source-in`
                ctx.globalCompositeOperation = 'source-in';
                ctx.fillStyle = tshirtColorOverlay.style.backgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw design image
                ctx.globalCompositeOperation = 'source-atop'; // Ensures design is applied over the color
                designImg.onload = () => {
                    const designWidth = designOverlay.offsetWidth;
                    const designHeight = designOverlay.offsetHeight;
                    const designTop = designOverlay.offsetTop;
                    const designLeft = designOverlay.offsetLeft;

                    const scaleX = canvas.width / tshirtPreview.offsetWidth;
                    const scaleY = canvas.height / tshirtPreview.offsetHeight;

                    // Draw design image with scaling
                    ctx.drawImage(designImg, designLeft * scaleX, designTop * scaleY, designWidth * scaleX, designHeight * scaleY);

                    // Create download link
                    const link = document.createElement('a');
                    link.href = canvas.toDataURL('image/png');
                    link.download = 'your-tshirt.png';
                    link.click();
                };

                designImg.src = designUrl;
            };

            tshirtImg.src = 'images/border.png'; // Your T-shirt image path
        } else {
            alert('Please upload a design first!');
        }
    });
});
