import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

interface FormData {
  url: string;
  title: string;
  description: string;
}

type File = {
  type: string;
  size: number;
};

const maxFileSize = 10 * 1024 * 1024; // 10 MEGABYTES

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const testedImage = /image\/(png|jpeg|gif)/;

  const formValidations = {
    image: {
      required: {
        message: 'Arquivo obrigatório',
        value: true,
      },
      validate: {
        lessThan10MB: (file: File[]) =>
          file[0].size < maxFileSize ||
          `O arquivo deve ser menor que ${maxFileSize / 1024 / 1024}MB`,
        acceptedFormats: (files: File[]) =>
          !!files[0].type.match(testedImage) ||
          'Somente são aceitos arquivos PNG, JPEG e GIF',
      },
    },
    title: {
      required: {
        message: 'Título obrigatório',
        value: true,
      },
      minLength: {
        message: 'Mínimo de 2 caracteres',
        value: 2,
      },
      maxLength: {
        message: 'Máximo de 20 caracteres',
        value: 20,
      },
    },
    description: {
      required: {
        message: 'Descrição obrigatório',
        value: true,
      },
      maxLength: {
        message: 'Máximo de 65 caracteres',
        value: 65,
      },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (image: FormData) => {
      const { data } = await api.post('/api/images', {
        ...image,
        url: imageUrl,
      });

      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit: SubmitHandler<FormData> = async (values): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'warning',
        });

        return;
      }

      await mutation.mutateAsync(values);

      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso',
        status: 'success',
      });
    } catch (e) {
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        status: 'error',
      });
    } finally {
      reset();
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors.title}
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.description}
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
