const Dashboard = {
  async init() {
    await this._initialData();
    this._initialListener();
  },

  async _initialData() {
    const fetchRecords = await fetch('/data/DATA.json')
    const responseRecords = await fetchRecords.json();

    console.log(responseRecords);

    this._userListStory = responseRecords.listStory;
    this._populateListRecordToTable(this._userListStory);
    this._populateListDataToCard(this._userListStory);
  },

  _initialListener() {
    const recordDetailModal = document.getElementById('recordDetailModal');
    recordDetailModal.addEventListener('show.bs.modal', (event) => {
      const modalTitle = recordDetailModal.querySelector('.modal-title');
      modalTitle.focus();

      const button = event.relatedTarget;
      const dataRecord = this._userListStory.find((item) => {
        return item.id == button.dataset.recordId;
      });

      this._populateDetailListToModal(dataRecord);
    });
  },

  _populateListDataToCard(listStory = null) {
    if (!(typeof listStory === 'object')) {
      throw new Error(`Parameter listStory should be an object. The value is ${listStory}`);
    }

    if (!Array.isArray(listStory)) {
      throw new Error(`Parameter listStory should be an array. The value is ${listStory}`);
    }

    document.querySelector('#numberOfStories').innerText = listStory.length;
  },

  _populateListRecordToTable(listStory = null) {
    if (!(typeof listStory === 'object')) {
      throw new Error(`Parameter listStory should be an object. The value is ${listStory}`);
    }

    if (!Array.isArray(listStory)) {
      throw new Error(`Parameter listStory should be an array. The value is ${listStory}`);
    }

    const recordBodyTable = document.querySelector('#recordsTable');

    recordBodyTable.innerHTML = '';
    if (listStory.length <= 0) {
      recordBodyTable.innerHTML = this._templateEmptyBodyTable();
      return;
    }

    listStory.forEach((item, idx) => {
      recordBodyTable.innerHTML += this._templateBodyTable(idx, listStory[idx]);
    });
  },

  _populateDetailListToModal(listRecord) {
    if (!(typeof listRecord === 'object')) {
      throw new Error(`Parameter listRecord should be an object. The value is ${listRecord}`);
    }

    const imgDetailRecord = document.querySelector('#recordDetailModal #imgDetailRecord');
    const nameDetailRecord = document.querySelector('#recordDetailModal #nameDetailRecord');
    const dateDetailRecord = document.querySelector('#recordDetailModal #dateDetailRecord');
    const descriptionDetailRecord = document.querySelector('#recordDetailModal #noteDetailRecord');

    imgDetailRecord.setAttribute('src', listRecord.photoUrl);
    imgDetailRecord.setAttribute('alt', listRecord.name);
    nameDetailRecord.textContent = listRecord.name;

    if (dateDetailRecord) {
      const date = new Date(listRecord.createdAt);
      const formattedDate = date.toDateString();
      dateDetailRecord.textContent = formattedDate;
    }

    descriptionDetailRecord.textContent = listRecord.description || '-';
  },

  _templateBodyTable(index, listRecord) {
    const date = new Date(listRecord.createdAt);
    const formattedDate = date.toDateString();

    return `
    <div  class="col-sm-6 col-md-4 col-lg-3">
    <div class="card h-100 shadow">
      <img src="${listRecord.photoUrl}" class="card-img-top" alt="${listRecord.name}">
      <div class="card-body">
        <h5 class="card-title">${listRecord.name}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${formattedDate}</h6>
        <p class="card-text">${listRecord.description}</p>
      </div>
      <div class="card-footer d-flex flex-column flex-sm-row gap-2 justify-center">
        <a class="btn btn-primary" href="#" 
           data-bs-toggle="modal" data-bs-target="#recordDetailModal" 
           data-record-id="${listRecord.id}">
          <i class="bi bi-eye-fill me-1"></i>Show
        </a>
        <a class="btn btn-warning" href="transactions/edit.html?id=${listRecord.id}">
          <i class="bi bi-pen-fill me-1"></i>Edit
        </a>
        <a class="btn btn-danger" href="#">
          <i class="bi bi-trash3-fill me-1"></i>Delete
        </a>
      </div>
    </div>
  </div>

    `;
  },

  _templateEmptyBodyTable() {
    const recordHeadTable = document.querySelector('#recordsTable thead');

    return `
      <tr>
        <td colspan="${recordHeadTable.querySelectorAll('td,th').length}">
          <div class="text-center">Tidak ada daftar cerita</div>
        </td>
      </tr>
    `;
  },
};

export default Dashboard;
