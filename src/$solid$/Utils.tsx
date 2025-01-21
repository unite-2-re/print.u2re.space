// @ts-ignore
import { onMount } from "solid-js";

// @ts-ignore
import {observeAttribute} from "/externals/lib/dom.js";

//
export const refAndMount = (cb)=>{
    return (element)=>{
        cb(element);
        onMount(()=>cb(element));
    }
}

//
export const observe = (val) => {
    return (el)=> {
        const [attr, setter] = val;
        observeAttribute(el, attr, (obs)=>setter(el.getAttribute(attr)));
    }
}

//
export const logged = (fx)=>{
    return (...args)=>{
        console.log(...args);
        return fx(...args);
    }
}

//
const hookHandle = {
    apply(target, thisArg, argumentsList) {
        target.target = argumentsList?.[0] ?? target.target;
    },
    set(target, name, value) {
        return target.target ? Reflect.set(target.target, name, value) : true;
    },
    get(target, name, receiver) {
        if (name == "@target") { return target.target; };
        return target.target ? Reflect.get(target.target, name) : null;
    },
    has(target, name) {
        return target.target ? Reflect.has(target.target, name) : false;
    },
    ownKeys(target) {
        return target.target ? Reflect.ownKeys(target.target) : [];
    }
};

//
export const hooked = (target = null)=>{
    const fx = ()=>{};
    fx.target = target;
    return new Proxy(fx, hookHandle);
};

//
const getterHandle = {
    apply(target, thisArg, argumentsList) {
        return target?.();//Reflect.apply(target?.(), thisArg, argumentsList);
    },
    set(target, name, value) {
        return Reflect.set(target?.(), name, value);
    },
    get(target, name, receiver) {
        if (name == "@target") { return target?.(); };
        return Reflect.get(target?.(), name, receiver);
    },
    has(target, name) {
        return Reflect.has(target?.(), name);
    },
    ownKeys(target) {
        return Reflect.ownKeys(target?.());
    }
};

//
export const getter = (target = null)=>{
    return new Proxy(target, getterHandle);
};
