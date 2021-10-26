import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  const widths = ['300px', '500px', '900px'];
  const heights = ['350px', '450px', '600px'];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW={widths} maxH={heights} mx="auto" w="auto" h="auto">
        <ModalBody p="0">
          <Image src={imgUrl} maxW={widths} maxH={heights} />
          <ModalFooter
            bg="pGray.800"
            h="2rem"
            py="20px"
            borderBottomRadius="5px"
          >
            <Link href={imgUrl} fontSize="1rem" mr="auto" isExternal>
              Abrir original
            </Link>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
