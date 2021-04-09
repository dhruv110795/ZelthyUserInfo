var userMap = {};

const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "https://jsonplaceholder.typicode.com/users",
      success: function (data) {
        resolve(data);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
};

const displayUserInfo = (info) => {
  var userContent = info;
  var userId, userName, userEmail, userAddress, userPhone, userWeb;
  userId = userContent["id"];
  userName = userContent["name"];
  userEmail = userContent["email"];
  userAddress = userContent["address"];
  userPhone = userContent["phone"];
  userWeb = userContent["website"];

  var userCard = `<div class="card col-md-3" id="user_card_${userId}"  style="padding: 15px;border-radius: 4px;">
            <div id="user_card" data-id=${userId}>
            <img width="180" src="https://avatars.dicebear.com/v2/avataaars/${userName}.svg?options%5bmood%5d%5b%5d=happy"/>
            <div id="user_card_body">
              <div class="card-body">
                <span class="card-title user-card-name">${userName}</span>
                <div class="user-card-sub">
                  <label class="material-icons-outlined md-18 user-card-icons">email</label>
                  <span class="card-text user-card-info user-card-email" >${userEmail}</span>
                </div>
                <div class="user-card-sub">
                  <label class="material-icons-outlined md-18 user-card-icons">phone_enabled</label>
                  <span class="card-text user-card-info user-card-phone">${userPhone}</span>
                </div>
                <div class="user-card-sub">
                  <label class="material-icons-outlined md-18 user-card-icons">language</label>
                  <span class="card-text user-card-info user-card-web">${userWeb}</span>
                </div>
              </div>
            </div>
            <div id="user_card_edit" class="row">
              <div class="col-md-12">
                <div class="col-md-4" style="border-right: 1px solid;">
                  <span class="md-18 material-icons material-icons-outlined" id="user_card_fav" data-id=${userId}>
                  favorite_border
                    </span>
                </div>
                <div class="col-md-4" style="border-right: 1px solid;" >
                  <span class="md-18 material-icons-outlined" style="padding:0px;" id="user_card_edit" data-id=${userId}>
                  border_color
                    </span>
                </div>
                <div class="col-md-4">
                  <span class="md-18 material-icons-outlined" id="user_card_delete" data-id=${userId}>
                    delete
                    </span>
                </div>
              </div>
            </div>
          </div>
        </div>`;
  $("#user_card_info").append(userCard);
};

$(document).ready(function () {
  getUserInfo()
    .then((data) => {
      for (var i = 0; i < data.length; i++) {
        userInfo = data[i];
        userMap[userInfo["id"]] = userInfo;
        displayUserInfo(userInfo);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

$(document).off("click", "#user_card_fav");
$(document).on("click", "#user_card_fav", function () {
  if ($(this).hasClass("user-fav-added")) {
    $(this).removeClass("user-fav-added");
  } else {
    $(this).addClass("user-fav-added");
    $(this).val("favorite_border");
  }
});

$(document).off("click", "#user_card_delete");
$(document).on("click", "#user_card_delete", function () {
  var id = $(this).attr("data-id");
  var id_dom = "#user_card_" + id;
  $(id_dom).remove();
});

$(document).off("click", "#user_card_edit");
$(document).on("click", "#user_card_edit", function () {
  var id = $(this).attr("data-id");
  var userInformation = userMap[id];
  $("#z_user_edit_dialogue").dialog({
    width: 400,
    height: 300,
    modal: true,
    title: "Edit : " + userInformation["name"],
    open: function(){
      $(".ui-dialog-titlebar-close").attr("title", "");
      $(".ui-dialog-titlebar-close").text("X").css({
          "color": "#000"
      });
      $("#z_user_edit_dialogue").attr("data-id",id);
      $("#user_edit_name").val(userInformation["name"]);
      $("#user_edit_email").val(userInformation["email"]);
      $("#user_edit_phone").val(userInformation["phone"]);
      $("#user_edit_web").val(userInformation["website"]);
    },
    beforeClose: function(){
      $(this).dialog("destroy");
    }
  });

  $("#z_user_edit_dialogue").dialog("open");
});

$(document).off("click", "#user_edit_cancel");
$(document).on("click", "#user_edit_cancel", function(){
  $("#z_user_edit_dialogue").dialog("destroy");
});


$(document).off("click","#user_edit_save");
$(document).on("click", "#user_edit_save",function(){
  var id = $(this).parents("#z_user_edit_dialogue").attr("data-id");
  var editedName , editedEmail, editedPhone, editedWeb, userCard;
  editedName = $("#user_edit_name").val();
  editedEmail = $("#user_edit_email").val();
  editedPhone = $("#user_edit_phone").val();
  editedWeb = $("#user_edit_web").val();

  userCard = "#user_card_" + id;
  $(userCard).children("#user_card").find("#user_card_body .card-body .user-card-name").text(editedName);
  $(userCard).children("#user_card").find("#user_card_body .card-body .user-card-email").text(editedEmail);
  $(userCard).children("#user_card").find("#user_card_body .card-body .user-card-phone").text(editedPhone);
  $(userCard).children("#user_card").find("#user_card_body .card-body .user-card-web").text(editedWeb);

  $(this).parents("#z_user_edit_dialogue").dialog("destroy");
});
