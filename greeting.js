const fileInput = document.getElementById('fileInput');
const uploadedImg = document.getElementById('uploadedImg');
const nameInput = document.getElementById('nameInput');
const nameBox = document.getElementById('nameBox');
const downloadBtn = document.getElementById('downloadBtn');
const whatsappBtn = document.getElementById('whatsappBtn');
const generalShareBtn = document.getElementById('generalShareBtn');

let shareableImageBlob = null;

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
    alert('Generate image first!');
    return;
  }
  const file = new File([shareableImageBlob], 'janmashtami-template.png', { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({ files: [file], title: 'Happy Janmashtami!', text: 'Here’s my greeting!' })
      .catch(err => console.error('Share failed:', err));
  } else {
    const msg = encodeURIComponent(`Happy Janmashtami!\n - ${nameInput.value}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }
});

generalShareBtn.addEventListener('click', () => {
  if (!shareableImageBlob) {
    alert('Generate image first!');
    return;
  }
  const file = new File([shareableImageBlob], 'janmashtami-template.png', { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({ files: [file], title: 'My Janmashtami Greeting', text: 'Check this out!' })
      .catch(err => console.error('Share failed:', err));
  } else {
    alert('Sharing not supported on this browser.');
  }
});

function generateImage(downloadAfter = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  const bg = new Image();
  bg.crossOrigin = 'anonymous';
  bg.src = ''janmastmi_template.jpg';

  bg.onload = () => {
    ctx.drawImage(bg, 0, 0, 400, 600);
    const drawFinal = () => {
      const name = nameInput.value || '';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#333';
      ctx.fillText(name, 317, 575);

      canvas.toBlob(blob => {
        shareableImageBlob = blob;
        if (downloadAfter) {
          const link = document.createElement('a');
          link.download = 'janmashtami-template.png';
          link.href = URL.createObjectURL(blob);
          link.click();
        }
      }, 'image/png');
    };

    if (uploadedImg.src) {
      const userImg = new Image();
      userImg.onload = () => {
       ctx.drawImage(userImg,249, 380, 135, 155);
        drawFinal();
      };
      userImg.src = uploadedImg.src;
    } else {
      drawFinal();
    }
  };
}

