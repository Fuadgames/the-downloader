document.addEventListener('DOMContentLoaded', () => {
    // Элементы DOM
    const openModalBtn = document.getElementById('openModalBtn');
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.close-btn');
    const projectForm = document.getElementById('projectForm');
    const projectFilesInput = document.getElementById('projectFiles');
    const fileListDiv = document.getElementById('fileList');
    const projectsContainer = document.getElementById('projectsContainer');
    const currentLangSpan = document.getElementById('currentLang');
    const langDropdown = document.querySelector('.language-switcher');
    
    // Текущий пользователь (заглушка)
    const currentUser = "GuestUser_123";

    // --- ЛОГИКА МОДАЛЬНОГО ОКНА ---
    
    // Открыть модальное окно
    openModalBtn.onclick = () => {
        modal.style.display = 'block';
    }

    // Закрыть модальное окно по крестику
    closeBtn.onclick = () => {
        modal.style.display = 'none';
    }

    // Закрыть модальное окно при клике вне его
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // --- ЛОГИКА ЗАГРУЗКИ ФАЙЛОВ И ОТОБРАЖЕНИЯ ---

    // Отображение выбранных файлов в поле #fileList
    projectFilesInput.addEventListener('change', () => {
        fileListDiv.innerHTML = ''; // Очистка предыдущего списка
        const files = projectFilesInput.files;
        
        if (files.length > 0) {
            const list = document.createElement('ul');
            list.style.listStyle = 'disc';
            list.style.paddingLeft = '20px';
            
            for (let i = 0; i < files.length; i++) {
                const listItem = document.createElement('li');
                // Отображение названия файла и размера
                listItem.textContent = `${files[i].name} (${(files[i].size / 1024 / 1024).toFixed(2)} MB)`;
                list.appendChild(listItem);
            }
            fileListDiv.appendChild(list);
        } else {
            fileListDiv.textContent = currentLang === 'ru' ? 'Файлы не выбраны' : 'No files selected';
        }
    });

    // --- ЛОГИКА ОТПРАВКИ ФОРМЫ (ПУБЛИКАЦИЯ ПРОЕКТА) ---

    projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const projectName = document.getElementById('projectName').value;
        const files = projectFilesInput.files;
        const osCheckboxes = document.querySelectorAll('input[name="os"]:checked');
        
        // Проверка, что хотя бы одна ОС выбрана
        if (osCheckboxes.length === 0) {
            alert(currentLang === 'ru' ? 'Пожалуйста, выберите хотя бы одну ОС.' : 'Please select at least one OS.');
            return;
        }

        const selectedOS = Array.from(osCheckboxes).map(cb => cb.value);

        // В реальном приложении здесь был бы AJAX-запрос на сервер 
        // для загрузки файлов и сохранения данных проекта.
        
        // --- ДЕМОНСТРАЦИЯ: СОЗДАНИЕ КАРТОЧКИ ПРОЕКТА ВМЕСТО РЕАЛЬНОЙ ЗАГРУЗКИ ---
        
        const fileNames = Array.from(files).map(f => f.name);

        const projectData = {
            name: projectName,
            files: fileNames,
            user: currentUser,
            os: selectedOS
        };

        // Добавление проекта на страницу
        addProjectCard(projectData);

        // Очистка формы и закрытие модального окна
        projectForm.reset();
        fileListDiv.innerHTML = '';
        modal.style.display = 'none';
    });

    // --- ФУНКЦИЯ ОТОБРАЖЕНИЯ ПРОЕКТА ---

    function addProjectCard(project) {
        // Удаляем заглушку "Проектов пока нет"
        const noProjectsEl = document.getElementById('projectsContainer').querySelector('p[data-i18n="noProjects"]');
        if (noProjectsEl) {
            noProjectsEl.remove();
        }
        
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <h4>${project.name}</h4>
            <p data-i18n="author">Автор:</p> <span>${project.user}</span>
            <p data-i18n="supportedOS">Поддерживаемые ОС:</p> <span class="os-support">${project.os.join(', ')}</span>
            <hr>
            <h5 data-i18n="availableFiles">Доступные файлы:</h5>
            ${project.files.map(file => `
                <div class="file-item">
                    <span>${file}</span>
                    <button data-file-name="${file}" data-i18n="downloadBtn">Скачать</button>
                </div>
            `).join('')}
        `;

        projectsContainer.appendChild(card);
        // Переводим новую карточку
        updateLanguage(currentLang);
    }
    
    // --- ЛОГИКА СКАЧИВАНИЯ (ДЕМОНСТРАЦИОННАЯ) ---

    // Обработка клика на кнопке "Скачать"
    projectsContainer.addEventListener('click', (e) => {
        if (e.target.matches('[data-file-name]')) {
            const fileName = e.target.dataset.fileName;
            alert(`${currentLang === 'ru' ? 'Начало скачивания файла' : 'Starting download for file'}: ${fileName}\n\n${currentLang === 'ru' ? 'В реальном приложении здесь был бы запрос на скачивание с сервера.' : 'In a real application, this would trigger a server download request.'}`);
        }
    });

    // --- ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ЯЗЫКА ---

    let currentLang = 'ru'; // Установка языка по умолчанию

    // Словарь для перевода
    const translations = {
        en: {
            projectsTitle: "Published Projects",
            noProjects: "No projects yet. Click '+' to create a new one.",
            createProjectTitle: "Create New Project",
            projectNameLabel: "Project Name:",
            projectFilesLabel: "Project Files:",
            osCompatibilityLabel: "OS Compatibility:",
            publishBtn: "Publish",
            author: "Author:",
            supportedOS: "Supported OS:",
            availableFiles: "Available Files:",
            downloadBtn: "Download",
        },
        ru: {
            projectsTitle: "Опубликованные Проекты",
            noProjects: "Проектов пока нет. Нажмите '+' для создания нового.",
            createProjectTitle: "Создать Новый Проект",
            projectNameLabel: "Название Проекта:",
            projectFilesLabel: "Файлы проекта:",
            osCompatibilityLabel: "Совместимость с ОС:",
            publishBtn: "Опубликовать",
            author: "Автор:",
            supportedOS: "Поддерживаемые ОС:",
            availableFiles: "Доступные файлы:",
            downloadBtn: "Скачать",
        }
    };
    
    // Функция обновления текста на странице
    function updateLanguage(lang) {
        currentLang = lang;
        currentLangSpan.textContent = lang.toUpperCase();
        
        // Устанавливаем атрибут lang для всей страницы
        document.documentElement.lang = lang; 

        // Обновление всех элементов с атрибутом data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                // Для кнопок и инпутов используем innerHTML/textContent
                if (element.tagName === 'BUTTON' || element.tagName === 'H2' || element.tagName === 'H5' || element.tagName === 'P') {
                    element.textContent = translations[lang][key];
                } 
                // Для меток (label) и заголовков (h3)
                else if (element.tagName === 'LABEL' || element.tagName === 'H3') {
                     element.textContent = translations[lang][key];
                }
            }
        });
        
        // Обновление заглушки для файлов
        if (projectFilesInput.files.length === 0) {
             fileListDiv.textContent = currentLang === 'ru' ? 'Файлы не выбраны' : 'No files selected';
        }
    }

    // Обработчик клика по элементам выпадающего списка
    langDropdown.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const newLang = e.target.getAttribute('data-lang');
            updateLanguage(newLang);
        });
    });

    // Инициализация языка при загрузке
    updateLanguage(currentLang);
});
