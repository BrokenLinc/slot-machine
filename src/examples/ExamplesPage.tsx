import * as UI from '@chakra-ui/react';
import * as icons from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAxios from 'axios-hooks';
import * as dateFns from 'date-fns';
import * as FramerMotion from 'framer-motion';
import _ from 'lodash';
import numeral from 'numeral';
import React from 'react';
import * as reactHookForm from 'react-hook-form';
import * as reactRouter from 'react-router-dom';
import * as reactUse from 'react-use';
import useLocalStorageState from 'use-local-storage-state';
import { useSearchParams } from 'react-router-dom';
import * as util from 'util';

import logoSrc from '../images/logo.svg';

// Wrap components with Framer Motion for use in animated components.
// (You only have to do this once.)
const MotionUI = {
  Box: FramerMotion.motion(UI.Box),
};

// https://create-react-app.dev/docs/adding-images-fonts-and-files/
const ImageExample: React.FC = () => {
  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with images
      </UI.Heading>
      <img src={logoSrc} alt="Logo" width="100" />
    </UI.Box>
  );
};

// http://numeraljs.com
const NumbersExample: React.FC = () => {
  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with numbers
      </UI.Heading>
      <UI.UnorderedList>
        <UI.ListItem>Formatting: {numeral(1000).format('0,0')}</UI.ListItem>
        <UI.ListItem>Formatting: {numeral(1000).format('0o')}</UI.ListItem>
      </UI.UnorderedList>
    </UI.Box>
  );
};

// https://date-fns.org/docs/Getting-Started
const DatesExample: React.FC = () => {
  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with dates
      </UI.Heading>
      <UI.UnorderedList>
        <UI.ListItem>
          Formatting: {dateFns.format(new Date(), 'MM/dd/yyyy')}
        </UI.ListItem>
      </UI.UnorderedList>
    </UI.Box>
  );
};

// https://fontawesome.com/v5.15/how-to-use/on-the-web/using-with/react
const IconExample: React.FC = () => {
  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with icons
      </UI.Heading>
      <UI.SimpleGrid gap={4} padding={4}>
        <FontAwesomeIcon icon={icons.faCoffee} />
        <FontAwesomeIcon icon={icons.faCoffee} flip="horizontal" />
        <FontAwesomeIcon icon={icons.faCoffee} spin />
      </UI.SimpleGrid>
    </UI.Box>
  );
};

// https://www.framer.com/docs/
const MotionExample: React.FC = () => {
  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with animation
      </UI.Heading>
      <MotionUI.Box
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        bg="green.300"
        borderRadius="4px"
        w="50px"
        h="50px"
        m={4}
      ></MotionUI.Box>
    </UI.Box>
  );
};

// https://chakra-ui.com/docs/feedback/toast
const ToastExample: React.FC = () => {
  const toast = UI.useToast();
  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with toasts
      </UI.Heading>
      <UI.Button
        mb={4}
        onClick={() =>
          toast({
            title: 'Account created.',
            description: "We've created your account for you.",
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        }
      >
        Show Toast
      </UI.Button>
    </UI.Box>
  );
};

// https://reactrouter.com/web/guides/quick-start
// (Add more routes in App.tsx.)
const LinksExample: React.FC = () => {
  const params = reactRouter.useParams<{ segment: string }>();

  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with links
      </UI.Heading>
      <UI.UnorderedList>
        <UI.ListItem>
          Plain link:{' '}
          <UI.Link as={reactRouter.Link} to="/" color="blue.300">
            examples
          </UI.Link>
        </UI.ListItem>
        <UI.ListItem>
          Link w/Segment:{' '}
          <UI.Link as={reactRouter.Link} to="/example-segment" color="blue.300">
            examples/example-segment
          </UI.Link>
        </UI.ListItem>
        <UI.ListItem>Captured segment: "{params.segment}"</UI.ListItem>
      </UI.UnorderedList>
    </UI.Box>
  );
};

// https://lodash.com/docs
const CollectionsExample: React.FC = () => {
  const mockList: string[] = ['react', 'is', 'neat'];

  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with collections
      </UI.Heading>
      <UI.UnorderedList>
        <UI.ListItem>
          <UI.Text>Rendering a list:</UI.Text>
          {_.map(mockList, (text, i) => (
            <UI.Badge key={i} mr={2} colorScheme="blue">
              {text}
            </UI.Badge>
          ))}
        </UI.ListItem>
      </UI.UnorderedList>
    </UI.Box>
  );
};

// https:github.com/streamich/react-use/blob/master/docs/useInterval.md
const IntervalExample: React.FC = () => {
  const [count, setCount] = React.useState(0);

  reactUse.useInterval(() => {
    setCount(count + 1);
  }, 1000);

  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with setInterval
      </UI.Heading>
      <UI.Text mb={2}>(The loop runs every second.)</UI.Text>
      <UI.Text mb={2}>Count: {count}</UI.Text>
    </UI.Box>
  );
};

// https://github.com/streamich/react-use/blob/master/docs/useCopyToClipboard.md
const CopyToClipboardExample: React.FC = () => {
  const url =
    'https://github.com/streamich/react-use/blob/master/docs/useCopyToClipboard.md';
  const [state, copyToClipboard] = reactUse.useCopyToClipboard();

  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with the clipboard
      </UI.Heading>
      <UI.InputGroup mb={2}>
        <UI.InputLeftAddon children="url" />
        <UI.Input readOnly defaultValue={url} />
      </UI.InputGroup>
      <UI.Button mb={2} onClick={() => copyToClipboard(url)}>
        Copy to clipbaord
      </UI.Button>
      {state.error ? (
        <UI.Text color="red.300">Unable to copy value.</UI.Text>
      ) : null}
      {state.value ? <UI.Text color="green.300">Copied!</UI.Text> : null}
    </UI.Box>
  );
};

// https://reactjs.org/docs/hooks-state.html
const StateExample: React.FC = () => {
  const [count, setCount] = React.useState(0);

  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with component state
      </UI.Heading>
      <UI.Button mb={2} onClick={() => setCount((value) => value + 1)}>
        Click me!
      </UI.Button>
      <UI.Text>The button has been clicked {count} times.</UI.Text>
    </UI.Box>
  );
};

// https://www.framer.com/docs/animate-presence/
const AnimatedPresenceExample: React.FC = () => {
  const [value, setValue] = React.useState(true);

  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with animated presence
      </UI.Heading>
      <UI.Button mb={2} onClick={() => setValue((value) => !value)}>
        Toggle
      </UI.Button>
      <FramerMotion.AnimatePresence>
        {value ? (
          <MotionUI.Box
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            bg="green.300"
            borderRadius="4px"
            w="50px"
            h="50px"
            m={4}
          ></MotionUI.Box>
        ) : null}
      </FramerMotion.AnimatePresence>
    </UI.Box>
  );
};

// https://www.framer.com/docs/component/
const TransitionExample: React.FC = () => {
  const [value, setValue] = React.useState(true);

  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with transitions
      </UI.Heading>
      <UI.Button mb={2} onClick={() => setValue((value) => !value)}>
        Toggle
      </UI.Button>
      <MotionUI.Box
        animate={{
          x: value ? 0 : 100,
        }}
        bg="green.300"
        borderRadius="4px"
        w="50px"
        h="50px"
        m={4}
      ></MotionUI.Box>
    </UI.Box>
  );
};

// https://github.com/streamich/react-use/blob/master/docs/usePrevious.md
const PreviousExample: React.FC = () => {
  const [value, setValue] = React.useState('');
  const previousValue = reactUse.usePrevious(value);

  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with the previous value
      </UI.Heading>
      <UI.Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        mb={4}
      />
      <UI.Text mb={2}>value: {value}</UI.Text>
      <UI.Text mb={2}>previous value: {previousValue}</UI.Text>
    </UI.Box>
  );
};

// https://github.com/pbeshai/use-query-params#readme
// Note that this implementation is dependent on React Router.
const QueryStateExample: React.FC = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const count = parseInt(searchParams.get('count') || '') || 0;
  const setCount = (count: number) => {
    setSearchParams({ count: count.toString() });
  };

  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with querystring state
      </UI.Heading>
      <UI.Button my={2} onClick={() => setCount(count + 1)}>
        Click me!
      </UI.Button>
      <UI.Text>The button has been clicked {count} times.</UI.Text>
    </UI.Box>
  );
};

// https://www.npmjs.com/package/use-local-storage-state
const LocalStorageExample: React.FC = () => {
  const [count, setCount, { removeItem }] = useLocalStorageState('count', {
    defaultValue: 0,
  });

  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with localstorage state
      </UI.Heading>
      <UI.Button mb={2} onClick={() => setCount(count + 1)}>
        Click me!
      </UI.Button>
      <UI.Text mb={2}>The button has been clicked {count} times.</UI.Text>
      <UI.Button
        colorScheme="red"
        variant="outline"
        size="xs"
        mb={2}
        onClick={() => removeItem()}
      >
        Clear
      </UI.Button>
    </UI.Box>
  );
};

// https://github.com/streamich/react-use/blob/master/docs/useKey.md
const KeyPressExample: React.FC = () => {
  const [count, setCount] = React.useState(0);
  reactUse.useKey('ArrowRight', () => setCount((count) => count + 1));

  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with keypress
      </UI.Heading>
      <UI.Text>
        (Press the <UI.Badge>ARROW RIGHT</UI.Badge> key to increment the
        counter.)
      </UI.Text>
      <UI.Text>The key has been pressed {count} times.</UI.Text>
    </UI.Box>
  );
};

// https://reactjs.org/docs/hooks-reference.html#useref
const ElementRefExample: React.FC = () => {
  const elementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    console.debug('Element ref', elementRef.current);
  }, []);

  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with element refs
      </UI.Heading>
      <UI.Text>Open the console to see the DOM element reference.</UI.Text>
      <UI.Box
        ref={elementRef}
        bg="green.300"
        borderRadius="4px"
        w="50px"
        h="50px"
        m={4}
      />
    </UI.Box>
  );
};

// https://github.com/streamich/react-use/blob/master/docs/useHover.md
const HoverExample: React.FC = () => {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const hovered = reactUse.useHoverDirty(elementRef);

  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with hover
      </UI.Heading>
      <UI.Box
        ref={elementRef}
        bg={hovered ? 'green.300' : 'gray.600'}
        borderRadius="4px"
        w="50px"
        h="50px"
        m={4}
      />
      {hovered ? (
        <UI.Badge colorScheme="green">Element is hovered</UI.Badge>
      ) : (
        <UI.Badge colorScheme="gray">Element is not hovered</UI.Badge>
      )}
    </UI.Box>
  );
};

// https://react-hook-form.com/get-started
type ExampleFormData = {
  example: string;
  exampleRequired: string;
};
const FormExample: React.FC = () => {
  const form = reactHookForm.useForm<ExampleFormData>({
    defaultValues: { example: 'test' },
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;
  const formData = watch();

  const onSubmit: reactHookForm.SubmitHandler<ExampleFormData> = (data) => {
    console.log(data);
  };

  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with forms
      </UI.Heading>
      <UI.Box mb={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <UI.FormControl mb={4}>
            <UI.Input {...register('example')} />
          </UI.FormControl>

          <UI.FormControl isInvalid={!!errors.exampleRequired} mb={4}>
            <UI.Input
              {...register('exampleRequired', {
                required: 'This field is required.',
              })}
            />
            <UI.FormErrorMessage>
              {errors.exampleRequired?.message}
            </UI.FormErrorMessage>
          </UI.FormControl>

          <UI.Button type="submit">Submit</UI.Button>
        </form>
      </UI.Box>
      <UI.UnorderedList>
        <UI.ListItem>data: {util.inspect(formData)}</UI.ListItem>
        <UI.ListItem>errors: {util.inspect(errors)}</UI.ListItem>
      </UI.UnorderedList>
    </UI.Box>
  );
};

// https://github.com/simoneb/axios-hooks
const RestExample: React.FC = () => {
  const [{ data, loading, error }, refetch] = useAxios(
    'https://baconipsum.com/api/?type=meat-and-filler&paras=1'
  );

  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with REST
      </UI.Heading>
      <UI.UnorderedList mb={2}>
        <UI.ListItem>loading: {JSON.stringify(loading)}</UI.ListItem>
        <UI.ListItem>error: {JSON.stringify(error)}</UI.ListItem>
        <UI.ListItem>data: {JSON.stringify(data)}</UI.ListItem>
      </UI.UnorderedList>
      <UI.Button mb={2} onClick={() => refetch()}>
        Refetch
      </UI.Button>
    </UI.Box>
  );
};

// https://reactjs.org/docs/context.html
interface ExampleContextShape {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}
const ExampleContext = React.createContext<ExampleContextShape>(
  {} as ExampleContextShape
);
const ContextExampleConsumer: React.FC = () => {
  const { count, setCount } = React.useContext(ExampleContext);
  return (
    <UI.Box>
      <UI.Button mb={2} onClick={() => setCount(count + 1)}>
        Click me!
      </UI.Button>
      <UI.Text mb={2}>The button has been clicked {count} times.</UI.Text>
    </UI.Box>
  );
};
const ContextExample: React.FC = () => {
  const [count, setCount] = React.useState(0);

  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Working with context
      </UI.Heading>
      <ExampleContext.Provider value={{ count, setCount }}>
        <ContextExampleConsumer />
        <ContextExampleConsumer />
        <ContextExampleConsumer />
      </ExampleContext.Provider>
    </UI.Box>
  );
};

export const ExamplesPage: React.FC = () => {
  const exampleComponents = [
    ImageExample,
    NumbersExample,
    DatesExample,
    IconExample,
    MotionExample,
    ToastExample,
    LinksExample,
    CollectionsExample,
    IntervalExample,
    CopyToClipboardExample,
    StateExample,
    AnimatedPresenceExample,
    TransitionExample,
    PreviousExample,
    QueryStateExample,
    LocalStorageExample,
    KeyPressExample,
    ElementRefExample,
    HoverExample,
    FormExample,
    RestExample,
    ContextExample,
  ];

  return (
    <UI.Box p="4">
      <UI.Heading size="3xl" mb={8}>
        Examples
      </UI.Heading>

      <UI.SimpleGrid minChildWidth="400px" spacing={2}>
        {_.map(exampleComponents, (Component) => (
          <UI.Box
            key={Component.name}
            bg="white"
            borderRadius="8px"
            p={6}
            minH="240px"
          >
            <Component />
          </UI.Box>
        ))}
      </UI.SimpleGrid>
    </UI.Box>
  );
};
