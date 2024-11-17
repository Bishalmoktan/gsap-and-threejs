import {
  OrbitControls,
  PerspectiveCamera,
  View,
} from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {  MutableRefObject, Suspense } from "react";
import * as THREE from "three";
import Lights from "./lights";
import Iphone from "./iphone";
import Loader from "./loader";

export interface ModelType {
  id: number;
  title: string;
  color: string[];
  img: string;
}

interface ModelViewProps {
  index: number;
  groupRef: MutableRefObject<THREE.Group<THREE.Object3DEventMap>>;
  gsapType: "view1" | "view2";
  controlRef: MutableRefObject<OrbitControlsImpl | null>;
  setRotationState: (value: number) => void;
  item: ModelType;
  size: "small" | "large";
}

const ModelView = ({
  index,
  controlRef,
  groupRef,
  gsapType,
  setRotationState,
  item,
  size,
}: ModelViewProps) => {
  return (
    <View
      index={index}
      id={gsapType}
      className={` w-full h-full absolute ${index === 2 ? "right-[-100%]" : ""}`}
    >
      <ambientLight intensity={0.3} />
      <PerspectiveCamera position={[0, 0, 4]} />

      <Lights />

      <OrbitControls
        makeDefault
        ref={controlRef}
        enableZoom={false}
        rotateSpeed={0.4}
        target={new THREE.Vector3(0, 0, 0)}
        onEnd={() => {
          if (controlRef.current) {
            setRotationState(controlRef.current.getAzimuthalAngle());
          }
        }}
      />

      <group
        ref={groupRef}
        name={`${index === 1 ? "small" : "large"}`}
        position={[0, 0, 0]}
      >
        <Suspense fallback={<Loader />}>
          <Iphone
            scale={index === 1 ? [25, 25, 25] : [32, 32, 32]}
            item={item}
            size={size}
          />
        </Suspense>
      </group>
    </View>
  );
};
export default ModelView;
