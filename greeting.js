const fileInput = document.getElementById('fileInput');
const uploadedImg = document.getElementById('uploadedImg');
const nameInput = document.getElementById('nameInput');
const nameBox = document.getElementById('nameBox');
const downloadBtn = document.getElementById('downloadBtn');
const whatsappBtn = document.getElementById('whatsappBtn');
const generalShareBtn = document.getElementById('generalShareBtn');

let shareableImageBlob = null;
let templateImage = null;

// Load template image once
const bg = new Image();
bg.onload = () => {
  templateImage = bg;
};
bg.src = 'janmastmi_template.jpg';

fileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    uploadedImg.src = ev.target.result;
    uploadedImg.style.display = 'block';
  };
  reader.readAsDataURL(file);
});

nameInput.addEventListener('input', () => {
  nameBox.textContent = nameInput.value;
});

downloadBtn.addEventListener('click', () => {
  generateImage(true);
});

whatsappBtn.addEventListener('click', () => {
  if (!shareableImageBlob) {
    alert('Please upload an image and click Download first!');
    return;
  }
  const file = new File([shareableImageBlob], 'janmashtami-greeting.png', { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({ files: [file], title: 'Happy Janmashtami!', text: 'Here\'s my greeting!' })
      .catch(err => console.error('Share failed:', err));
  } else {
    const msg = encodeURIComponent(`Happy Janmashtami!\n - ${nameInput.value || 'Anonymous'}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }
});

generalShareBtn.addEventListener('click', () => {
  if (!shareableImageBlob) {
    alert('Please upload an image and click Download first!');
    return;
  }
  const file = new File([shareableImageBlob], 'janmashtami-greeting.png', { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({ files: [file], title: 'My Janmashtami Greeting', text: 'Check this out!' })
      .catch(err => console.error('Share failed:', err));
  } else {
    // Fallback: create a download link
    const link = document.createElement('a');
    link.download = 'janmashtami-greeting.png';
    link.href = URL.createObjectURL(shareableImageBlob);
    link.click();
  }
});

function generateImage(downloadAfter = false) {
  if (!templateImage) {
    alert('Template image is still loading. Please wait a moment and try again.');
    return;
  }

  const canvas = document.createElement('canvas');
  // Use template image dimensions
  canvas.width = templateImage.naturalWidth || 800;
  canvas.height = templateImage.naturalHeight || 1200;
  
  const ctx = canvas.getContext('2d');

  // Draw background template
  ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);

  // Function to draw the final image with user content
  const drawFinal = () => {
    const name = nameInput.value || '';
    
    // Draw name text - position it near the photo frame
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#333';
    ctx.fillText(name, canvas.width * 0.85, canvas.height * 0.95);

    // Convert to blob and handle download/share
    canvas.toBlob(blob => {
      shareableImageBlob = blob;
      if (downloadAfter) {
        const link = document.createElement('a');
        link.download = 'janmashtami-greeting.png';
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href); // Clean up
      }
    }, 'image/png', 0.9);
  };

  // Handle uploaded image
  if (uploadedImg.src && uploadedImg.src !== '') {
    const userImg = new Image();
    userImg.onload = () => {
      // Position the uploaded image in the bottom right photo frame area
      // Based on the template design, the photo frame is in the bottom right
      const imgWidth = canvas.width * 0.25; // 25% of canvas width
      const imgHeight = canvas.height * 0.3; // 30% of canvas height
      const imgX = canvas.width * 0.7; // Position in bottom right area
      const imgY = canvas.height * 0.6; // Position vertically in bottom area
      
      ctx.drawImage(userImg, imgX, imgY, imgWidth, imgHeight);
      drawFinal();
    };
    userImg.onerror = () => {
      console.error('Failed to load uploaded image');
      drawFinal();
    };
    userImg.src = uploadedImg.src;
  } else {
    drawFinal();
  }
}
