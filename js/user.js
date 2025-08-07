// 在DOMContentLoaded事件内添加以下代码

// 设置按钮功能 - 切换编辑模式
document.querySelector('.settings-link').addEventListener('click', function(e) {
    e.preventDefault();
    document.body.classList.toggle('edit-mode');
    if (document.body.classList.contains('edit-mode')) {
        this.innerHTML = '<i class="fas fa-save"></i>';
        showSuccessMessage('已进入编辑模式');
    } else {
        this.innerHTML = '<i class="fas fa-edit"></i>';
        showSuccessMessage('已退出编辑模式');
    }
});

// 初始化用户简介
const userBio = document.getElementById('userBio');
const bioContent = localStorage.getItem('blogBio') || '';
userBio.textContent = bioContent;
if (!bioContent) {
    userBio.setAttribute('placeholder', '点击这里添加个人简介...');
}

// 保存用户简介
document.getElementById('saveBioBtn').addEventListener('click', function() {
    const content = userBio.textContent.trim();
    localStorage.setItem('blogBio', content);
    showSuccessMessage('个人简介已保存');
});

// 重置用户简介
document.getElementById('resetBioBtn').addEventListener('click', function() {
    userBio.textContent = '';
    localStorage.removeItem('blogBio');
    userBio.setAttribute('placeholder', '点击这里添加个人简介...');
    showSuccessMessage('个人简介已重置');
});

// 初始化卡片数据
const hobbies = JSON.parse(localStorage.getItem('blogHobbies')) || ['动漫收藏与评论', '数字绘画创作', 'Cosplay角色扮演'];
const games = JSON.parse(localStorage.getItem('blogGames')) || ['原神', '崩坏：星穹铁道', '塞尔达传说：王国之泪'];
const animes = JSON.parse(localStorage.getItem('blogAnimes')) || ['我推的孩子 第二季', '死神 千年血战篇', '鬼灭之刃 锻刀村篇'];

// 渲染列表
renderList('hobbyList', hobbies, 'fas fa-check');
renderList('gameList', games, 'fab fa-steam');
renderList('animeList', animes, 'fas fa-play-circle');

// 渲染列表函数
function renderList(listId, items, iconClass) {
    const ul = document.getElementById(listId);
    ul.innerHTML = '';
    
    if (items.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.textContent = '暂无内容，点击下方按钮添加';
        ul.appendChild(emptyState);
        return;
    }
    
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <i class="${iconClass}"></i>
            <span class="editable-item" contenteditable="true">${item}</span>
            <div class="item-actions">
                <button class="item-btn delete-item" data-index="${index}" data-list="${listId}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        ul.appendChild(li);
        
        // 添加删除事件
        li.querySelector('.delete-item').addEventListener('click', function() {
            const list = this.dataset.list;
            const index = parseInt(this.dataset.index);
            deleteItem(list, index);
        });
        
        // 添加输入事件
        const editableItem = li.querySelector('.editable-item');
        editableItem.addEventListener('input', function() {
            saveItem(listId, index, this.textContent);
        });
    });
}

// 保存项目
function saveItem(listId, index, value) {
    let items = [];
    if (listId === 'hobbyList') {
        items = JSON.parse(localStorage.getItem('blogHobbies')) || [];
    } else if (listId === 'gameList') {
        items = JSON.parse(localStorage.getItem('blogGames')) || [];
    } else if (listId === 'animeList') {
        items = JSON.parse(localStorage.getItem('blogAnimes')) || [];
    }
    
    if (index >= 0 && index < items.length) {
        items[index] = value;
        
        if (listId === 'hobbyList') {
            localStorage.setItem('blogHobbies', JSON.stringify(items));
        } else if (listId === 'gameList') {
            localStorage.setItem('blogGames', JSON.stringify(items));
        } else if (listId === 'animeList') {
            localStorage.setItem('blogAnimes', JSON.stringify(items));
        }
    }
}

// 删除项目
function deleteItem(listId, index) {
    let items = [];
    if (listId === 'hobbyList') {
        items = JSON.parse(localStorage.getItem('blogHobbies')) || [];
    } else if (listId === 'gameList') {
        items = JSON.parse(localStorage.getItem('blogGames')) || [];
    } else if (listId === 'animeList') {
        items = JSON.parse(localStorage.getItem('blogAnimes')) || [];
    }
    
    if (index >= 0 && index < items.length) {
        items.splice(index, 1);
        
        if (listId === 'hobbyList') {
            localStorage.setItem('blogHobbies', JSON.stringify(items));
        } else if (listId === 'gameList') {
            localStorage.setItem('blogGames', JSON.stringify(items));
        } else if (listId === 'animeList') {
            localStorage.setItem('blogAnimes', JSON.stringify(items));
        }
        
        // 重新渲染列表
        renderList(listId, items, 
            listId === 'hobbyList' ? 'fas fa-check' : 
            listId === 'gameList' ? 'fab fa-steam' : 'fas fa-play-circle');
        
        checkEmptyState();
        showSuccessMessage('项目已删除');
    }
}

// 添加新项目
document.querySelectorAll('.add-item-btn').forEach(button => {
    button.addEventListener('click', function() {
        const listId = this.dataset.target;
        let items = [];
        let iconClass = '';
        
        if (listId === 'hobbyList') {
            items = JSON.parse(localStorage.getItem('blogHobbies')) || [];
            iconClass = 'fas fa-check';
        } else if (listId === 'gameList') {
            items = JSON.parse(localStorage.getItem('blogGames')) || [];
            iconClass = 'fab fa-steam';
        } else if (listId === 'animeList') {
            items = JSON.parse(localStorage.getItem('blogAnimes')) || [];
            iconClass = 'fas fa-play-circle';
        }
        
        // 添加新项目
        items.push('新项目');
        
        // 保存
        if (listId === 'hobbyList') {
            localStorage.setItem('blogHobbies', JSON.stringify(items));
        } else if (listId === 'gameList') {
            localStorage.setItem('blogGames', JSON.stringify(items));
        } else if (listId === 'animeList') {
            localStorage.setItem('blogAnimes', JSON.stringify(items));
        }
        
        // 重新渲染列表
        renderList(listId, items, iconClass);
        
        // 聚焦到新项目
        const list = document.getElementById(listId);
        const lastItem = list.lastElementChild;
        const editableItem = lastItem.querySelector('.editable-item');
        setTimeout(() => {
            editableItem.focus();
            // 选中文本
            const range = document.createRange();
            range.selectNodeContents(editableItem);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }, 50);
        
        checkEmptyState();
    });
});

// 检查空状态
function checkEmptyState() {
    const lists = ['hobbyList', 'gameList', 'animeList'];
    lists.forEach(listId => {
        const ul = document.getElementById(listId);
        if (ul.children.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = '暂无内容，点击下方按钮添加';
            ul.appendChild(emptyState);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
        // 从localStorage获取用户信息
        const nickname = localStorage.getItem('blogNickname') || '萌小兔';
        const phone = localStorage.getItem('blogPhone') || '13800138000';
        const avatarFile = localStorage.getItem('blogAvatar') || '';
        
        // 更新用户名
        document.getElementById('usernameDisplay').textContent = nickname;
        
        // 更新头像
        const avatarImg = document.getElementById('userAvatar');
        if (avatarFile) {
            // 使用本地存储的头像
            avatarImg.src = 'avatars/' + avatarFile;
        } else {
            // 使用默认头像（网络图片）
            avatarImg.src = 'https://img.lellse.net/i/2024/05/25/66511a7b3b5b0.webp';
        }
        
        // 更新手机号（部分隐藏）
        const formattedPhone = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        document.getElementById('phone').textContent = formattedPhone;
        
        // 设置按钮功能
        document.querySelector('.settings-link').addEventListener('click', function(e) {
            e.preventDefault();
            alert('设置功能正在开发中...');
        });
        
        // 头像选择功能 - 新增代码
        const avatarModal = document.getElementById('avatarModal');
        const avatarGrid = document.getElementById('avatarGrid');
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        const pageInfo = document.getElementById('pageInfo');
        const confirmBtn = document.getElementById('confirmAvatar');
        const closeModalBtn = document.querySelector('.close-modal');
        
        // 头像选择变量
        let currentPage = 1;
        const avatarsPerPage = 12;
        const totalAvatars = 226;
        const totalPages = Math.ceil(totalAvatars / avatarsPerPage);
        let selectedAvatar = null;
        
        // 打开模态框
        document.querySelector('.change-avatar-btn').addEventListener('click', function() {
            avatarModal.style.display = 'flex';
            loadAvatars(currentPage);
        });
        
        // 关闭模态框
        closeModalBtn.addEventListener('click', function() {
            avatarModal.style.display = 'none';
        });
        
        // 点击模态框外部关闭
        avatarModal.addEventListener('click', function(e) {
            if (e.target === avatarModal) {
                avatarModal.style.display = 'none';
            }
        });
        
        // 上一页
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                loadAvatars(currentPage);
            }
        });
        
        // 下一页
        nextPageBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                loadAvatars(currentPage);
            }
        });
        
        // 加载头像
        function loadAvatars(page) {
            avatarGrid.innerHTML = '';
            const start = (page - 1) * avatarsPerPage + 1;
            const end = Math.min(page * avatarsPerPage, totalAvatars);
            
            // 更新分页状态
            pageInfo.textContent = `${page} / ${totalPages}`;
            prevPageBtn.disabled = page === 1;
            nextPageBtn.disabled = page === totalPages;
            
            // 创建头像元素
            for (let i = start; i <= end; i++) {
                const avatarItem = document.createElement('div');
                avatarItem.className = 'avatar-item';
                avatarItem.dataset.avatar = `avatar${i}.png`;
                
                const img = document.createElement('img');
                img.src = `avatars/avatar${i}.png`;
                img.alt = `头像 ${i}`;
                
                avatarItem.appendChild(img);
                avatarGrid.appendChild(avatarItem);
                
                // 添加点击事件
                avatarItem.addEventListener('click', function() {
                    // 移除之前选中的样式
                    document.querySelectorAll('.avatar-item').forEach(item => {
                        item.classList.remove('selected');
                    });
                    
                    // 添加选中样式
                    this.classList.add('selected');
                    selectedAvatar = this.dataset.avatar;
                    
                    // 激活确认按钮
                    confirmBtn.classList.add('active');
                    confirmBtn.disabled = false;
                });
            }
        }
        
        // 确认选择头像
        confirmBtn.addEventListener('click', function() {
            if (!selectedAvatar) return;
            
            // 更新头像
            avatarImg.src = `avatars/${selectedAvatar}`;
            
            // 保存到localStorage
            localStorage.setItem('blogAvatar', selectedAvatar);
            
            // 关闭模态框
            avatarModal.style.display = 'none';
            
            // 显示成功消息
            showSuccessMessage('头像更新成功！');
        });
        
        // 显示成功消息
        function showSuccessMessage(message) {
            // 移除之前的消息
            const oldMessage = document.querySelector('.success-message');
            if (oldMessage) oldMessage.remove();
            
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = message;
            successMessage.style.position = 'fixed';
            successMessage.style.bottom = '30px';
            successMessage.style.left = '50%';
            successMessage.style.transform = 'translateX(-50%)';
            successMessage.style.backgroundColor = 'rgba(107, 203, 255, 0.9)';
            successMessage.style.color = 'white';
            successMessage.style.padding = '15px 30px';
            successMessage.style.borderRadius = '30px';
            successMessage.style.fontWeight = '600';
            successMessage.style.zIndex = '2000';
            successMessage.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
            successMessage.style.animation = 'fadeInOut 3s forwards';
            
            document.body.appendChild(successMessage);
            
            // 3秒后移除消息
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        }
    });