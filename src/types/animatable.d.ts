import { AnimatableProperties } from "react-native-animatable";

declare module "react-native-animatable" {
  interface Animation {
    scatterLeft: AnimatableProperties;
    scatterRight: AnimatableProperties;
  }
}
