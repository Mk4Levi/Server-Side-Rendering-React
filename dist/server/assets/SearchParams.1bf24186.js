import { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { j as jsxs, a as jsx, A as AdoptedPetContext } from "../ServerApp.js";
import "react-dom/server";
import "react-router-dom/server.mjs";
import "react/jsx-runtime";
const Pet = (props) => {
  const {
    name,
    animal,
    breed,
    images,
    location,
    id
  } = props;
  let hero = "http://pets-images.dev-apis.com/pets/none.jpg";
  if (images.length) {
    hero = images[0];
  }
  return /* @__PURE__ */ jsxs(Link, {
    to: `/details/${id}`,
    className: "pet",
    children: [/* @__PURE__ */ jsx("div", {
      className: "image-container",
      children: /* @__PURE__ */ jsx("img", {
        src: hero,
        alt: name
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "info",
      children: [/* @__PURE__ */ jsx("h1", {
        children: name
      }), /* @__PURE__ */ jsx("h2", {
        children: `${animal} \u2014 ${breed} \u2014 ${location}`
      })]
    })]
  });
};
const Results = ({
  pets
}) => {
  return /* @__PURE__ */ jsx("div", {
    className: "search",
    children: !pets.length ? /* @__PURE__ */ jsx("h1", {
      children: "No Pets Found"
    }) : pets.map((pet) => {
      return /* @__PURE__ */ jsx(Pet, {
        animal: pet.animal,
        name: pet.name,
        breed: pet.breed,
        images: pet.images,
        location: `${pet.city}, ${pet.state}`,
        id: pet.id
      }, pet.id);
    })
  });
};
async function fetchBreedList({ queryKey }) {
  const animal = queryKey[1];
  if (!animal)
    return [];
  const res = await fetch(
    `http://pets-v2.dev-apis.com/breeds?animal=${animal}`
  );
  if (!res.ok) {
    throw new Error(`breeds ${animal} fetch not ok`);
  }
  return res.json();
}
function useBreedList(animal) {
  var _a, _b;
  const results = useQuery(["breeds", animal], fetchBreedList);
  return [(_b = (_a = results == null ? void 0 : results.data) == null ? void 0 : _a.breeds) != null ? _b : [], results.status];
}
async function fetchSearch({ queryKey }) {
  const { animal, location, breed } = queryKey[1];
  const res = await fetch(
    `http://pets-v2.dev-apis.com/pets?animal=${animal}&location=${location}&breed=${breed}`
  );
  if (!res.ok)
    throw new Error(`pet search not okay: ${animal}, ${location}, ${breed}`);
  return res.json();
}
const ANIMALS = ["bird", "cat", "dog", "rabbit", "reptile"];
const SearchParams = () => {
  var _a, _b;
  const [requestParams, setRequestParams] = useState({
    location: "",
    animal: "",
    breed: ""
  });
  const [adoptedPet] = useContext(AdoptedPetContext);
  const [animal, setAnimal] = useState("");
  const [breeds] = useBreedList(animal);
  const results = useQuery(["search", requestParams], fetchSearch);
  const pets = (_b = (_a = results == null ? void 0 : results.data) == null ? void 0 : _a.pets) != null ? _b : [];
  return /* @__PURE__ */ jsxs("div", {
    className: "search-params",
    children: [/* @__PURE__ */ jsxs("form", {
      onSubmit: (e) => {
        var _a2, _b2, _c;
        e.preventDefault();
        const formData = new FormData(e.target);
        const obj = {
          animal: (_a2 = formData.get("animal")) != null ? _a2 : "",
          breed: (_b2 = formData.get("breed")) != null ? _b2 : "",
          location: (_c = formData.get("location")) != null ? _c : ""
        };
        setRequestParams(obj);
      },
      children: [adoptedPet ? /* @__PURE__ */ jsx("div", {
        className: "pet image-container",
        children: /* @__PURE__ */ jsx("img", {
          src: adoptedPet.images[0],
          alt: adoptedPet.name
        })
      }) : null, /* @__PURE__ */ jsxs("label", {
        htmlFor: "location",
        children: ["Location", /* @__PURE__ */ jsx("input", {
          id: "location",
          name: "location",
          placeholder: "Location"
        })]
      }), /* @__PURE__ */ jsxs("label", {
        htmlFor: "animal",
        children: ["Animal", /* @__PURE__ */ jsxs("select", {
          id: "animal",
          name: "animal",
          onChange: (e) => {
            setAnimal(e.target.value);
          },
          onBlur: (e) => {
            setAnimal(e.target.value);
          },
          children: [/* @__PURE__ */ jsx("option", {}), ANIMALS.map((animal2) => /* @__PURE__ */ jsx("option", {
            value: animal2,
            children: animal2
          }, animal2))]
        })]
      }), /* @__PURE__ */ jsxs("label", {
        htmlFor: "breed",
        children: ["Breed", /* @__PURE__ */ jsxs("select", {
          disabled: !breeds.length,
          id: "breed",
          name: "breed",
          children: [/* @__PURE__ */ jsx("option", {}), breeds.map((breed) => /* @__PURE__ */ jsx("option", {
            value: breed,
            children: breed
          }, breed))]
        })]
      }), /* @__PURE__ */ jsx("button", {
        children: "Submit"
      })]
    }), /* @__PURE__ */ jsx(Results, {
      pets
    })]
  });
};
export {
  SearchParams as default
};
