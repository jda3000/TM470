import { http } from "../../../services";
import { store } from "../../../redux/store";


export function fetchLikes() {
  let params = {
    beat: this.props.item.id,
  };
  http.get("common/api/like_list", { params: params }).then(
    response => {
      this.props.onLikesChange(response.data);
    },
  ).catch(
    error => {
      console.log(error);
    },
  );
}

export function unLike() {
  // get Like id of current user Like
  let like = this.props.item.likes.find(like => like.user.id === this.currentUser.id);
  let params = {
    id: like.id,
  };
  http.delete("common/api/like_detail", { params: params }).then(
    response => {
      this.fetchLikes();
    },
  ).catch(
    error => {
      console.log(error);
    },
  );
}

export function like() {
  // do not allow current user to like their own beat: Maybe should be on DB level
  if (this.currentUser.id !== this.props.item.user.id) {
    let data = {
      user: store.getState().currentUser.id,
      beat: this.props.item.id,
    };
    http.post("common/api/like_detail", data).then(
      response => {
        this.fetchLikes();
      },
    ).catch(
      error => {
        console.log(error);
      },
    );

  }
}

export function likeUnLike() {
  this.userHasLiked ? this.unLike() : this.like();
}
