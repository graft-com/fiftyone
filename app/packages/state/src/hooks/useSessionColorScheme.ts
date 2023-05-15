import * as foq from "@fiftyone/relay";
import * as fos from "@fiftyone/state";
import { useErrorHandler } from "react-error-boundary";
import { useMutation } from "react-relay";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  CustomizeColor,
  datasetName,
  sessionColorScheme,
  stateSubscription,
  view,
} from "../recoil";
import useSendEvent from "./useSendEvent";

const useSessionColorScheme = () => {
  const send = useSendEvent(true);
  const subscription = useRecoilValue(stateSubscription);
  const [commit] = useMutation<foq.setColorSchemeMutation>(foq.setColorScheme);
  const onError = useErrorHandler();
  const [computedSessionColorScheme, setSessionColorSchemeState] =
    useRecoilState(sessionColorScheme);
  const dataset = useRecoilValue(datasetName);
  const setDataset = fos.useSetDataset();
  const stages = useRecoilValue(view);

  function setColorScheme(
    colorPool: string[],
    customizedColorSettings: CustomizeColor[],
    saveToApp = false
  ) {
    const combined = {
      colorPool,
      customizedColorSettings,
    };

    const saveFormat = {
      colorPool,
      customizedColorSettings: JSON.stringify(customizedColorSettings),
    };

    return send((session) =>
      commit({
        onCompleted: () => {
          setSessionColorSchemeState(combined);
          if (saveToApp) {
            setDataset(dataset);
          }
        },
        onError,
        variables: {
          subscription,
          session,
          dataset,
          stages,
          colorScheme: combined,
          saveToApp: saveToApp,
          colorSchemeSaveFormat: saveFormat,
        },
      })
    );
  }

  const [opacity, setOpacity] = useRecoilState(fos.alpha(false));
  const [colorBy, setColorBy] = useRecoilState(
    fos.appConfigOption({ key: "colorBy", modal: false })
  );
  const [useMulticolorKeypoints, setUseMultiplecolorKeypoints] = useRecoilState(
    fos.appConfigOption({ key: "multicolorKeypoints", modal: false })
  );
  const [showSkeleton, setShowSkeleton] = useRecoilState(
    fos.appConfigOption({ key: "showSkeletons", modal: false })
  );

  const props = {
    opacity,
    colorBy: colorBy as "field" | "value",
    useMulticolorKeypoints: useMulticolorKeypoints as boolean,
    showSkeleton: showSkeleton as boolean,
    setOpacity,
    setColorBy,
    setUseMultiplecolorKeypoints,
    setShowSkeleton,
  };

  return { setColorScheme, props, computedSessionColorScheme };
};

export default useSessionColorScheme;
