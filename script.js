let images = JSON.parse(localStorage.getItem("images")) || [];
let currentIndex = 0;
let displayTime = (localStorage.getItem("displayTime") || 0) * 60 * 1000; 
let timer;

// 初期設定の画像
const defaultImage = "default_image.png"; 

// 画像をロードする
function loadImage(index) {
    if (images.length > 0) {
        document.getElementById("currentImage").src = images[index].url;
    } else {
        document.getElementById("currentImage").src = defaultImage; // 初期画像
    }
}

// 次の画像へ
function nextImage() {
    currentIndex = (currentIndex + 1) % (images.length || 1);
    loadImage(currentIndex);
    resetTimer();
}

// 前の画像へ
function prevImage() {
    currentIndex = (currentIndex - 1 + (images.length || 1)) % (images.length || 1);
    loadImage(currentIndex);
    resetTimer();
}

// タイマーを開始
function startTimer() {
    timer = setTimeout(nextImage, displayTime);
}

// タイマーをリセット
function resetTimer() {
    clearTimeout(timer);
    startTimer();
}

// 設定モーダルを開く
function openSettings() {
    document.getElementById("settingsModal").style.display = "block";
    updateImageList();
}

// 設定モーダルを閉じる
function closeSettings() {
    document.getElementById("settingsModal").style.display = "none";
}

// 画像リストを更新する
function updateImageList() {
    const imageList = document.getElementById("imageList");
    imageList.innerHTML = ""; 
    images.forEach((image, index) => {
        const div = document.createElement("div");
        div.className = "image-item";
        div.innerHTML = `画像${index + 1}: ${image.name}
            <button onclick="moveImageUp(${index})">↑</button>
            <button onclick="moveImageDown(${index})">↓</button>
            <button onclick="deleteImage(${index})">削除</button>`;
        imageList.appendChild(div);
    });
}

// 画像を削除する
function deleteImage(index) {
    images.splice(index, 1);
    localStorage.setItem("images", JSON.stringify(images));
    updateImageList();
    if (currentIndex >= images.length) {
        currentIndex = 0;
    }
    loadImage(currentIndex);
}

// 画像を上に移動する
function moveImageUp(index) {
    if (index > 0) {
        [images[index - 1], images[index]] = [images[index], images[index - 1]];
        localStorage.setItem("images", JSON.stringify(images));
        updateImageList();
        loadImage(currentIndex);
    }
}

// 画像を下に移動する
function moveImageDown(index) {
    if (index < images.length - 1) {
        [images[index + 1], images[index]] = [images[index], images[index + 1]];
        localStorage.setItem("images", JSON.stringify(images));
        updateImageList();
        loadImage(currentIndex);
    }
}

// 設定を保存
function saveSettings() {
    const hours = document.getElementById("displayHours").value;
    const minutes = document.getElementById("displayMinutes").value;
    displayTime = (parseInt(hours) * 60 + parseInt(minutes)) * 60 * 1000;
    localStorage.setItem("displayTime", (parseInt(hours) * 60 + parseInt(minutes)));
    resetTimer();
}

// 画像をアップロードして保存
function saveImages() {
    const uploadInput = document.getElementById("uploadImage");
    if (uploadInput.files.length > 0) {
        for (const file of uploadInput.files) {
            const url = URL.createObjectURL(file);
            if (images.length < 30) {
                images.push({url: url, name: file.name});
                localStorage.setItem("images", JSON.stringify(images));
            } else {
                alert("画像の最大登録数は30枚です。");
                break;
            }
        }
    }
    updateImageList();
}

// 初期化
loadImage(currentIndex);
startTimer();
