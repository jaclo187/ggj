'use strict';


$('#loginModal').on('shown.bs.modal', function () {
  $('#btn-login').trigger('focus')
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('window loaded')
});


