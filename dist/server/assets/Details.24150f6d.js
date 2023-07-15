var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { Component, lazy, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { j as jsxs, a as jsx, A as AdoptedPetContext } from "../ServerApp.js";
import "react-dom/server";
import "react-router-dom/server.mjs";
import "react/jsx-runtime";
class ErrorBoundary extends Component {
  constructor() {
    super(...arguments);
    __publicField(this, "state", {
      hasError: false
    });
  }
  static getDerivedStateFromError() {
    return {
      hasError: true
    };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsxs("h2", {
        children: ["There was an error with this listing. ", /* @__PURE__ */ jsx(Link, {
          to: "/",
          children: "Click here"
        }), " ", "to back to the home page."]
      });
    }
    return this.props.children;
  }
}
const ErrorBoundary$1 = ErrorBoundary;
const fetchPet = async ({ queryKey }) => {
  const id = queryKey[1];
  const apiRes = await fetch(`http://pets-v2.dev-apis.com/pets?id=${id}`);
  if (!apiRes.ok) {
    throw new Error(`details/${id} fetch not ok`);
  }
  return apiRes.json();
};
class Carousel extends Component {
  constructor() {
    super(...arguments);
    __publicField(this, "state", {
      active: 0
    });
    __publicField(this, "handleIndexClick", (event) => {
      this.setState({
        active: +event.target.dataset.index
      });
    });
  }
  render() {
    const {
      active
    } = this.state;
    const {
      images
    } = this.props;
    return /* @__PURE__ */ jsxs("div", {
      className: "carousel",
      children: [/* @__PURE__ */ jsx("img", {
        src: images[active],
        alt: "animal"
      }), /* @__PURE__ */ jsx("div", {
        className: "carousel-smaller",
        children: images.map((photo, index) => /* @__PURE__ */ jsx("img", {
          src: photo,
          className: index === active ? "active" : "",
          alt: "animal thumbnail",
          onClick: this.handleIndexClick,
          "data-index": index
        }, photo))
      })]
    });
  }
}
__publicField(Carousel, "defaultProps", {
  images: ["http://pets-images.dev-apis.com/pets/none.jpg"]
});
const Modal = lazy(() => import("./Modal.0f55878e.js"));
const Details = () => {
  const [showModal, setShowModal] = useState(false);
  const {
    id
  } = useParams();
  const results = useQuery(["details", id], fetchPet);
  const navigate = useNavigate();
  const [_, setAdoptedPet] = useContext(AdoptedPetContext);
  if (results.isLoading) {
    return /* @__PURE__ */ jsx("div", {
      className: "loading-pane",
      children: /* @__PURE__ */ jsx("h2", {
        className: "loader",
        children: "\u{1F300}"
      })
    });
  }
  const pet = results.data.pets[0];
  return /* @__PURE__ */ jsxs("div", {
    className: "details",
    children: [/* @__PURE__ */ jsx(Carousel, {
      images: pet.images
    }), /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("h1", {
        children: pet.name
      }), /* @__PURE__ */ jsx("h2", {
        children: `${pet.animal} \u2014 ${pet.breed} \u2014 ${pet.city}, ${pet.state}`
      }), /* @__PURE__ */ jsxs("button", {
        onClick: () => setShowModal(true),
        children: ["Adopt ", pet.name]
      }), /* @__PURE__ */ jsx("p", {
        children: pet.description
      }), showModal ? /* @__PURE__ */ jsx(Modal, {
        children: /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsxs("h1", {
            children: ["Would you like to Adopt ", pet.name, "?"]
          }), /* @__PURE__ */ jsxs("div", {
            className: "buttons",
            children: [/* @__PURE__ */ jsx("button", {
              onClick: () => {
                setAdoptedPet(pet);
                navigate("/");
              },
              children: "Yes"
            }), /* @__PURE__ */ jsx("button", {
              onClick: () => setShowModal(false),
              children: "No"
            })]
          })]
        })
      }) : null]
    })]
  });
};
function DetailsErrorBoundary(props) {
  return /* @__PURE__ */ jsx(ErrorBoundary$1, {
    children: /* @__PURE__ */ jsx(Details, {
      ...props
    })
  });
}
export {
  DetailsErrorBoundary as default
};
