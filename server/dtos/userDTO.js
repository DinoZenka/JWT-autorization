module.exports = class UserDTO {    // DTO - data transfer object
  id;
  mail;
  isActivated;

  constructor(model) {
    this.id = model._id;
    this.mail = model.mail;
    this.isActivated = model.isActivated;
  }
}